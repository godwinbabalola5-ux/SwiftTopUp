const db = require("../config/db");

// ======================
// Get Settings (admin — full detail)
// ======================
const getSettings = (req, res) => {

    db.query(
        "SELECT * FROM settings WHERE id = 1 LIMIT 1",
        (err, result) => {

            if (err) {
                return res.status(500).json({
                    success: false,
                    message: err.message
                });
            }

            if (result.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: "Settings not found."
                });
            }

            res.json({
                success: true,
                settings: result[0]
            });

        }
    );

};

// ======================
// Get Public Settings (no auth required)
// ======================
// Deliberately returns ONLY what's safe to show a regular, logged-out
// visitor — company name and support contact info. NOT markup
// percentages, funding limits, or anything else business-sensitive
// that the full getSettings() above exposes to admins only.
const getPublicSettings = (req, res) => {

    db.query(
        "SELECT company_name, support_email, support_phone FROM settings WHERE id = 1 LIMIT 1",
        (err, result) => {

            if (err) {
                return res.status(500).json({
                    success: false,
                    message: err.message
                });
            }

            if (result.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: "Settings not found."
                });
            }

            res.json({
                success: true,
                settings: result[0]
            });

        }
    );

};

// ======================
// Update Settings
// ======================
const updateSettings = (req, res) => {

    const {

        company_name,
        support_email,
        support_phone,

        minimum_funding,
        maximum_funding,

        airtime_markup,
        data_markup,
        cable_markup,
        electricity_markup,

        deposit_fee,

        airtime_enabled,
        data_enabled,
        cable_enabled,
        electricity_enabled,

        maintenance_mode

    } = req.body;

    db.query(

        `
        UPDATE settings SET

            company_name = ?,
            support_email = ?,
            support_phone = ?,

            minimum_funding = ?,
            maximum_funding = ?,

            airtime_markup = ?,
            data_markup = ?,
            cable_markup = ?,
            electricity_markup = ?,

            deposit_fee = ?,

            airtime_enabled = ?,
            data_enabled = ?,
            cable_enabled = ?,
            electricity_enabled = ?,

            maintenance_mode = ?

        WHERE id = 1
        `,

        [

            company_name,
            support_email,
            support_phone,

            minimum_funding,
            maximum_funding,

            airtime_markup,
            data_markup,
            cable_markup,
            electricity_markup,

            deposit_fee,

            airtime_enabled,
            data_enabled,
            cable_enabled,
            electricity_enabled,

            maintenance_mode

        ],

        (err) => {

            if (err) {

                console.log("SETTINGS UPDATE ERROR:", err);

                return res.status(500).json({
                    success: false,
                    message: err.message
                });

            }

            res.json({

                success: true,
                message: "Settings updated successfully."

            });

        }

    );

};

module.exports = {

    getSettings,
    getPublicSettings,
    updateSettings

};