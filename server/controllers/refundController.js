const db = require("../config/db");
const createNotification = require("../utils/createNotification");

const refundTransaction = async (req, res) => {

    const { reference } = req.params;

    if (!reference) {
        return res.status(400).json({
            success: false,
            message: "Transaction reference is required."
        });
    }

    try {

        // Find transaction
        const [transactions] = await db.query(
            `
            SELECT *
            FROM transactions
            WHERE reference = ?
            LIMIT 1
            `,
            [reference]
        );

        if (transactions.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Transaction not found."
            });
        }

        const transaction = transactions[0];

        // Prevent duplicate refund
        if (transaction.refund_status === "refunded") {
            return res.status(400).json({
                success: false,
                message: "This transaction has already been refunded."
            });
        }

        // Only failed transactions can be refunded
        if (transaction.status !== "failed") {
            return res.status(400).json({
                success: false,
                message: "Only failed transactions can be refunded."
            });
        }

        const refundAmount = Number(transaction.amount);

        if (!refundAmount || refundAmount <= 0) {
            return res.status(400).json({
                success: false,
                message: "Invalid refund amount."
            });
        }

        // Mark refund as pending
        await db.query(
            `
            UPDATE transactions
            SET
                refund_status = 'pending',
                refund_amount = ?
            WHERE id = ?
            `,
            [refundAmount, transaction.id]
        );

        // Credit wallet
        await db.query(
            `
            UPDATE users
            SET wallet = wallet + ?
            WHERE id = ?
            `,
            [refundAmount, transaction.user_id]
        );

        // Mark refund as completed
        await db.query(
            `
            UPDATE transactions
            SET
                refund_status = 'refunded',
                refunded_at = NOW()
            WHERE id = ?
            `,
            [transaction.id]
        );

        // Notify user
        createNotification(
            transaction.user_id,
            "Transaction Refunded",
            `₦${refundAmount.toLocaleString()} has been refunded to your wallet.`
        );

        // Real-time notification
        const io = req.app.get("io");

        if (io) {

            io.to(`user_${transaction.user_id}`).emit(
                "newNotification",
                {
                    title: "Transaction Refunded",
                    message:
                        `₦${refundAmount.toLocaleString()} has been refunded to your wallet.`
                }
            );

        }

        return res.json({
            success: true,
            message: "Transaction refunded successfully.",
            refundAmount
        });

    } catch (error) {

        console.log("REFUND ERROR:", error);

        return res.status(500).json({
            success: false,
            message: error.message
        });

    }

};

module.exports = {
    refundTransaction
};