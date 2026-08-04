const { query } = require("../config/db");

const getRecentTransactions = (req, res) => {

    const userId = req.user.id;

    query(

        `SELECT
            id,
            type,
            amount,
            status,
            created_at
        FROM transactions
        WHERE user_id = ?
        ORDER BY created_at DESC
        LIMIT 5`,

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

    getRecentTransactions

};