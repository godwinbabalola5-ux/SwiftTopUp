const { query } = require("../config/db");

const fundWallet = (req, res) => {
   // your existing fundWallet code
};

const getWalletBalance = (req, res) => {

    const userId = req.user.id;

    db.query(
        "SELECT wallet FROM users WHERE id = ?",
        [userId],
        (err, results) => {

            if (err) {
                return res.status(500).json({
                    success: false,
                    message: err.message
                });
            }

            res.json({
                success: true,
                wallet: results[0].wallet
            });

        }
    );
};
const getTransactions = (req, res) => {

    const userId = req.user.id;

    db.query(
        `SELECT
            type,
            amount,
            status,
            reference,
            created_at
        FROM transactions
        WHERE user_id = ?
        ORDER BY created_at DESC`,
        [userId],
        (err, results) => {

            if (err) {
                return res.status(500).json({
                    success: false,
                    message: err.message
                });
            }

            res.json({
                success: true,
                transactions: results
            });

        }
    );

};
module.exports = {
    fundWallet,
    getWalletBalance,
    getTransactions
};