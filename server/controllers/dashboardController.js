const { query } = require("../config/db");

const getDashboard = (req, res) => {

    const userId = req.user.id;

    const dashboard = {};

    query(

        `SELECT
            fullname,
            wallet,
            email
        FROM users
        WHERE id = ?`,

        [userId],

        (err, userResult) => {

            if (err) {

                return res.status(500).json({

                    success: false,
                    message: err.message

                });

            }

            if (userResult.length === 0) {

                return res.status(404).json({

                    success: false,
                    message: "User not found."

                });

            }

            dashboard.user = {

                fullname: userResult[0].fullname,
                email: userResult[0].email,
                wallet: Number(userResult[0].wallet)

            };

            query(

                `SELECT COUNT(*) AS totalTransactions
                 FROM transactions
                 WHERE user_id = ?`,

                [userId],

                (err, totalResult) => {

                    if (err) {

                        return res.status(500).json({

                            success: false,
                            message: err.message

                        });

                    }

                    dashboard.totalTransactions =
                        totalResult[0].totalTransactions;

                    query(

                        `SELECT
                            type,
                            COUNT(*) AS total
                         FROM transactions
                         WHERE user_id = ?
                         GROUP BY type`,

                        [userId],

                        (err, summaryResult) => {

                            if (err) {

                                return res.status(500).json({

                                    success: false,
                                    message: err.message

                                });

                            }

                            dashboard.summary = {

                                fund: 0,
                                airtime: 0,
                                data: 0,
                                electricity: 0,
                                cable: 0

                            };

                            summaryResult.forEach(item => {

                                dashboard.summary[item.type] = item.total;

                            });

                            query(

                                `SELECT
                                    id,
                                    type,
                                    amount,
                                    status,
                                    reference,
                                    created_at
                                 FROM transactions
                                 WHERE user_id = ?
                                 ORDER BY created_at DESC
                                 LIMIT 5`,

                                [userId],

                                (err, recentResult) => {

                                    if (err) {

                                        return res.status(500).json({

                                            success: false,
                                            message: err.message

                                        });

                                    }

                                    dashboard.recentTransactions = recentResult;

                                    res.json({

                                        success: true,
                                        dashboard

                                    });

                                }

                            );

                        }

                    );

                }

            );

        }

    );

};

module.exports = {

    getDashboard

};