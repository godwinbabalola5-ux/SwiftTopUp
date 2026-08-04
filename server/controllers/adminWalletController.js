const db = require("../config/db");

// ======================================
// Get All Users for Wallet Management
// ======================================
const getWalletUsers = (req, res) => {

    db.query(
        `
        SELECT
            id,
            fullname,
            email,
            phone,
            wallet,
            status
        FROM users
        ORDER BY fullname ASC
        `,
        (err, result) => {

            if (err) {
                return res.status(500).json({
                    success: false,
                    message: err.message
                });
            }

            res.json({
                success: true,
                users: result
            });

        }
    );

};

// ======================================
// Credit / Debit Wallet
// ======================================
const updateWallet = (req, res) => {

    const { id } = req.params;
    const { amount, type, reason } = req.body;

    if (!amount || amount <= 0) {
        return res.status(400).json({
            success: false,
            message: "Invalid amount."
        });
    }

    db.query(
        "SELECT wallet FROM users WHERE id=?",
        [id],
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
                    message: "User not found."
                });
            }

            let currentBalance = Number(result[0].wallet);
            let newBalance = currentBalance;

            if (type === "credit") {
                newBalance += Number(amount);
            } else {

                if (currentBalance < amount) {
                    return res.status(400).json({
                        success: false,
                        message: "Insufficient wallet balance."
                    });
                }

                newBalance -= Number(amount);
            }

            db.query(
                "UPDATE users SET wallet=? WHERE id=?",
                [newBalance, id],
                (err) => {

                    if (err) {
                        return res.status(500).json({
                            success: false,
                            message: err.message
                        });
                    }

                    db.query(
                        `
                        INSERT INTO wallet_adjustments
                        (
                            admin_id,
                            user_id,
                            type,
                            amount,
                            reason
                        )
                        VALUES (?, ?, ?, ?, ?)
                        `,
                        [
                            req.user.id,
                            id,
                            type,
                            amount,
                            reason
                        ],
                        (err) => {

                            if (err) {
                                return res.status(500).json({
                                    success: false,
                                    message: err.message
                                });
                            }

                            res.json({
                                success: true,
                                message: "Wallet updated successfully.",
                                newBalance
                            });

                        }
                    );

                }
            );

        }
    );

};

// ======================================
// Wallet History
// ======================================
const getWalletHistory = (req, res) => {

    db.query(
        `
        SELECT
            wa.*,
            u.fullname AS customer,
            a.fullname AS admin
        FROM wallet_adjustments wa

        JOIN users u
        ON wa.user_id = u.id

        JOIN users a
        ON wa.admin_id = a.id

        ORDER BY wa.created_at DESC
        `,
        (err, result) => {

            if (err) {
                return res.status(500).json({
                    success: false,
                    message: err.message
                });
            }

            res.json({
                success: true,
                history: result
            });

        }
    );

};

module.exports = {
    getWalletUsers,
    updateWallet,
    getWalletHistory
};