const db = require("../config/db");

// Which "type" values are valid — keeps bad/typo'd data out of the table
// and matches the four purchase pages this feature supports.
const VALID_TYPES = ["airtime", "data", "electricity", "cable"];

// ==========================================
// GET BENEFICIARIES
// ==========================================
// Optionally filtered by type via ?type=airtime — the frontend always
// asks for one type at a time since each purchase page only cares
// about its own kind of beneficiary.

const getBeneficiaries = async (req, res) => {

    try {

        const userId = req.user.id;
        const { type } = req.query;

        let sql = "SELECT id, type, label, value, network FROM beneficiaries WHERE user_id = ?";
        const params = [userId];

        if (type) {

            if (!VALID_TYPES.includes(type)) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid beneficiary type."
                });
            }

            sql += " AND type = ?";
            params.push(type);

        }

        sql += " ORDER BY created_at DESC";

        const [rows] = await db.query(sql, params);

        return res.json({
            success: true,
            beneficiaries: rows
        });

    } catch (error) {

        console.log("GET BENEFICIARIES ERROR:", error);

        return res.status(500).json({
            success: false,
            message: "Unable to load saved beneficiaries."
        });

    }

};


// ==========================================
// ADD BENEFICIARY
// ==========================================

const addBeneficiary = async (req, res) => {

    try {

        const userId = req.user.id;
        const { type, label, value, network } = req.body;

        if (!type || !VALID_TYPES.includes(type)) {
            return res.status(400).json({
                success: false,
                message: "A valid type is required (airtime, data, electricity, or cable)."
            });
        }

        if (!label || !label.trim()) {
            return res.status(400).json({
                success: false,
                message: "A label is required (e.g. \"My phone\")."
            });
        }

        if (!value || !value.trim()) {
            return res.status(400).json({
                success: false,
                message: "A phone/meter/smartcard number is required."
            });
        }

        // Quietly prevent obvious duplicates — same user, same type,
        // same number — rather than letting the list fill up with copies.
        const [existing] = await db.query(
            "SELECT id FROM beneficiaries WHERE user_id = ? AND type = ? AND value = ?",
            [userId, type, value.trim()]
        );

        if (existing.length > 0) {
            return res.status(400).json({
                success: false,
                message: "This number is already saved."
            });
        }

        const [result] = await db.query(
            `INSERT INTO beneficiaries (user_id, type, label, value, network)
             VALUES (?, ?, ?, ?, ?)`,
            [
                userId,
                type,
                label.trim(),
                value.trim(),
                network || null
            ]
        );

        return res.json({
            success: true,
            message: "Beneficiary saved.",
            beneficiary: {
                id: result.insertId,
                type,
                label: label.trim(),
                value: value.trim(),
                network: network || null
            }
        });

    } catch (error) {

        console.log("ADD BENEFICIARY ERROR:", error);

        return res.status(500).json({
            success: false,
            message: "Unable to save beneficiary."
        });

    }

};


// ==========================================
// DELETE BENEFICIARY
// ==========================================

const deleteBeneficiary = async (req, res) => {

    try {

        const userId = req.user.id;
        const { id } = req.params;

        // The "AND user_id = ?" here matters — without it, any logged-in
        // user could delete anyone else's beneficiary just by guessing IDs.
        const [result] = await db.query(
            "DELETE FROM beneficiaries WHERE id = ? AND user_id = ?",
            [id, userId]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: "Beneficiary not found."
            });
        }

        return res.json({
            success: true,
            message: "Beneficiary removed."
        });

    } catch (error) {

        console.log("DELETE BENEFICIARY ERROR:", error);

        return res.status(500).json({
            success: false,
            message: "Unable to remove beneficiary."
        });

    }

};


module.exports = {
    getBeneficiaries,
    addBeneficiary,
    deleteBeneficiary
};
