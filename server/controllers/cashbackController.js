const { query } = require("../config/db");

// =======================================
// REWARD CASHBACK
// =======================================

const rewardCashback = async (
    userId,
    transactionId,
    purchaseAmount
) => {

    try {

        const cashback = Number(
            (Number(purchaseAmount) * 0.02).toFixed(2)
        );

        await query(
            `
            UPDATE users
            SET
                wallet = wallet + ?,
                cashback = cashback + ?
            WHERE id = ?
            `,
            [
                cashback,
                cashback,
                userId
            ]
        );

        await query(
            `
            INSERT INTO cashback_history
            (
                user_id,
                transaction_id,
                amount
            )
            VALUES (?, ?, ?)
            `,
            [
                userId,
                transactionId,
                cashback
            ]
        );

        await query(
            `
            INSERT INTO notifications
            (
                user_id,
                title,
                message
            )
            VALUES (?, ?, ?)
            `,
            [
                userId,
                "🎉 Cashback Earned",
                `Congratulations! You earned ₦${cashback.toFixed(2)} cashback.`
            ]
        );

        console.log(
            `✅ Cashback of ₦${cashback.toFixed(2)} successfully added.`
        );

        return {
            success: true,
            cashback
        };

    } catch (error) {

        console.log("========== CASHBACK ERROR ==========");
        console.log(error.message);
        console.log("====================================");

        return {
            success: false,
            cashback: 0,
            error: error.message
        };

    }

};


// =======================================
// GET CASHBACK HISTORY
// =======================================

const getCashbackHistory = async (req, res) => {

    try {

        const userId = req.user.id;

        const history = await query(
            `
            SELECT
                ch.id,
                ch.amount,
                ch.created_at,
                t.type AS transaction_type,
                t.reference,
                t.provider,
                t.customer

            FROM cashback_history ch

            LEFT JOIN transactions t
                ON ch.transaction_id = t.id

            WHERE ch.user_id = ?

            ORDER BY ch.created_at DESC
            `,
            [userId]
        );

        const total = await query(
            `
            SELECT
                IFNULL(SUM(amount), 0) AS totalEarned
            FROM cashback_history
            WHERE user_id = ?
            `,
            [userId]
        );

        const users = await query(
            `
            SELECT cashback
            FROM users
            WHERE id = ?
            `,
            [userId]
        );

        return res.json({

            success: true,

            totalEarned: Number(
                total[0]?.totalEarned || 0
            ),

            cashbackBalance: Number(
                users[0]?.cashback || 0
            ),

            history

        });

    } catch (error) {

        console.log(
            "========== CASHBACK HISTORY ERROR =========="
        );

        console.log(error.message);

        console.log(
            "============================================="
        );

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

};


// =======================================
// WITHDRAW CASHBACK
// =======================================

const withdrawCashback = async (req, res) => {

    try {

        const userId = req.user.id;

        const {
            amount,
            bank_name,
            account_number,
            account_name
        } = req.body;


        // =======================================
        // VALIDATE INPUT
        // =======================================

        if (
            !amount ||
            !bank_name ||
            !account_number ||
            !account_name
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "All withdrawal fields are required."

            });

        }


        const withdrawalAmount = Number(amount);


        if (
            !Number.isFinite(withdrawalAmount) ||
            withdrawalAmount <= 0
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Enter a valid withdrawal amount."

            });

        }


        // Minimum withdrawal
        if (withdrawalAmount < 100) {

            return res.status(400).json({

                success: false,

                message:
                    "Minimum cashback withdrawal is ₦100."

            });

        }


        // =======================================
        // GET USER CASHBACK
        // =======================================

        const users = await query(

            `
            SELECT
                id,
                cashback
            FROM users
            WHERE id = ?
            `,

            [userId]

        );


        if (users.length === 0) {

            return res.status(404).json({

                success: false,

                message: "User not found."

            });

        }


        const cashbackBalance =
            Number(users[0].cashback || 0);


        // =======================================
        // CHECK BALANCE
        // =======================================

        if (cashbackBalance < withdrawalAmount) {

            return res.status(400).json({

                success: false,

                message:
                    "Insufficient cashback balance."

            });

        }


        // =======================================
        // GENERATE REFERENCE
        // =======================================

        const reference =
            `CW${Date.now()}`;


        // =======================================
        // DEDUCT CASHBACK
        // =======================================

        await query(

            `
            UPDATE users
            SET cashback = cashback - ?
            WHERE id = ?
            `,

            [
                withdrawalAmount,
                userId
            ]

        );


        // =======================================
        // SAVE WITHDRAWAL
        // =======================================

        await query(

            `
            INSERT INTO cashback_withdrawals
            (
                user_id,
                amount,
                bank_name,
                account_number,
                account_name,
                status,
                reference
            )
            VALUES (?, ?, ?, ?, ?, ?, ?)
            `,

            [
                userId,
                withdrawalAmount,
                bank_name,
                account_number,
                account_name,
                "pending",
                reference
            ]

        );


        // =======================================
        // NOTIFICATION
        // =======================================

        await query(

            `
            INSERT INTO notifications
            (
                user_id,
                title,
                message
            )
            VALUES (?, ?, ?)
            `,

            [
                userId,

                "💰 Cashback Withdrawal",

                `Your ₦${withdrawalAmount.toLocaleString()} cashback withdrawal request has been submitted successfully.`
            ]

        );


        // =======================================
        // REAL-TIME NOTIFICATION
        // =======================================

        const io = req.app.get("io");


        if (io) {

            io.to(`user_${userId}`).emit(

                "newNotification",

                {

                    title:
                        "💰 Cashback Withdrawal",

                    message:
                        `Your ₦${withdrawalAmount.toLocaleString()} cashback withdrawal request has been submitted successfully.`

                }

            );

        }


        // =======================================
        // RESPONSE
        // =======================================

        return res.json({

            success: true,

            message:
                "Cashback withdrawal request submitted successfully.",

            reference,

            amount: withdrawalAmount,

            status: "pending"

        });


    } catch (error) {

        console.log(
            "========== CASHBACK WITHDRAWAL ERROR =========="
        );

        console.log(error.message);

        console.log(
            "================================================"
        );


        return res.status(500).json({

            success: false,

            message:
                error.message

        });

    }

};


// =======================================
// EXPORTS
// =======================================

module.exports = {

    rewardCashback,
    getCashbackHistory,
    withdrawCashback

};