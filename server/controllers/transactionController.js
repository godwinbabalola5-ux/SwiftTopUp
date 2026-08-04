const { query } = require("../config/db");

const getTransactions = (req, res) => {

    const userId = req.user.id;

    query(

        `SELECT
            id,
            type,
            amount,
            status,
            reference,
            provider,
            customer,
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

const getTransactionById = (req, res) => {

    const userId = req.user.id;

    const transactionId = req.params.id;

    query(

        `SELECT
            id,
            type,
            amount,
            status,
            reference,
            provider,
            customer,
            response,
            created_at
        FROM transactions
        WHERE id = ?
        AND user_id = ?`,

        [

            transactionId,
            userId

        ],

        (err, results) => {

            if (err) {

                return res.status(500).json({

                    success: false,
                    message: err.message

                });

            }

            if (results.length === 0) {

                return res.status(404).json({

                    success: false,
                    message: "Transaction not found."

                });

            }

            res.json({

                success: true,
                transaction: results[0]

            });

        }

    );

};

module.exports = {

    getTransactions,
    getTransactionById

};