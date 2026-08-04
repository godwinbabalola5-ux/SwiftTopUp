const { query } = require("../config/db");

const getAnalytics = (req, res) => {

    const userId = req.user.id;

    query(
        `
        SELECT
            COUNT(*) AS totalTransactions,
            IFNULL(SUM(amount),0) AS totalSpent,
            COUNT(CASE WHEN type='airtime' THEN 1 END) AS airtime,
            COUNT(CASE WHEN type='data' THEN 1 END) AS dataPurchases,
            COUNT(CASE WHEN type='electricity' THEN 1 END) AS electricity,
            COUNT(CASE WHEN type='cable' THEN 1 END) AS cable
        FROM transactions
        WHERE user_id=?
        `,
        [userId],
        (err, result) => {

            if (err) {
                return res.status(500).json({
                    success: false,
                    message: err.message
                });
            }

            query(
                `
                SELECT
                    wallet,
                    referral_bonus,
                    total_referrals
                FROM users
                WHERE id=?
                `,
                [userId],
                (err, user) => {

                    if (err) {
                        return res.status(500).json({
                            success: false,
                            message: err.message
                        });
                    }

                    res.json({

                        success: true,

                        analytics: {

                            wallet: Number(user[0].wallet),

                            referralBonus: Number(user[0].referral_bonus || 0),

                            totalReferrals: Number(user[0].total_referrals || 0),

                            totalTransactions: result[0].totalTransactions,

                            totalSpent: Number(result[0].totalSpent),

                            airtime: result[0].airtime,

                            data: result[0].dataPurchases,

                            electricity: result[0].electricity,

                            cable: result[0].cable

                        }

                    });

                }

            );

        }

    );

};

module.exports = {
    getAnalytics
};