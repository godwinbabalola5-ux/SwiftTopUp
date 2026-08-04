const db = require("../config/db");
const createNotification = require("../utils/createNotification");

// ==========================================
// REQUEST REFUND
// ==========================================

const requestRefund = async (req, res) => {

    try {

        const { id } = req.params;
        const { amount, reason } = req.body;

        const refundAmount = Number(amount);

        if (!refundAmount || refundAmount <= 0) {

            return res.status(400).json({
                success: false,
                message: "Invalid refund amount."
            });

        }

        const [transactions] = await db.query(
            `
            SELECT *
            FROM transactions
            WHERE id = ?
            LIMIT 1
            `,
            [id]
        );

        if (transactions.length === 0) {

            return res.status(404).json({
                success: false,
                message: "Transaction not found."
            });

        }

        const transaction = transactions[0];

        if (transaction.status !== "failed") {

            return res.status(400).json({
                success: false,
                message: "Only failed transactions can be refunded."
            });

        }

        if (transaction.refund_status !== "none") {

            return res.status(400).json({
                success: false,
                message: "This transaction already has a refund request."
            });

        }

        if (refundAmount > Number(transaction.amount)) {

            return res.status(400).json({
                success: false,
                message: "Refund amount cannot exceed transaction amount."
            });

        }

        await db.query(
            `
            UPDATE transactions
            SET
                refund_status = 'pending',
                refund_amount = ?,
                failure_reason = ?
            WHERE id = ?
            `,
            [
                refundAmount,
                reason || "Customer refund request",
                id
            ]
        );

        return res.json({
            success: true,
            message: "Refund request created successfully."
        });

    } catch (error) {

        console.log(error);

        return res.status(500).json({
            success: false,
            message: error.message
        });

    }

};


// ==========================================
// GET PENDING REFUND REQUESTS
// ==========================================

const getRefundRequests = async (req, res) => {

    try {

        const [refunds] = await db.query(`
            SELECT
                t.id,
                t.user_id,
                t.reference,
                t.type,
                t.amount,
                t.status,
                t.refund_status,
                t.refund_amount,
                t.failure_reason,
                t.created_at,

                u.fullname AS customer,
                u.email AS email,
                u.phone AS phone

            FROM transactions t

            JOIN users u
                ON t.user_id = u.id

            WHERE t.refund_status = 'pending'

            ORDER BY t.created_at DESC
        `);

        return res.json({
            success: true,
            refunds
        });

    } catch (error) {

        console.log("GET REFUND REQUESTS ERROR:", error);

        return res.status(500).json({
            success: false,
            message: error.message
        });

    }

};


// ==========================================
// APPROVE REFUND
// ==========================================

const approveRefund = async (req, res) => {

    const connection = await db.getConnection();

    try {

        const { id } = req.params;

        await connection.beginTransaction();

        const [transactions] = await connection.query(
            `
            SELECT *
            FROM transactions
            WHERE id = ?
            FOR UPDATE
            `,
            [id]
        );

        if (transactions.length === 0) {

            await connection.rollback();

            return res.status(404).json({
                success: false,
                message: "Transaction not found."
            });

        }

        const transaction = transactions[0];

        if (transaction.refund_status !== "pending") {

            await connection.rollback();

            return res.status(400).json({
                success: false,
                message: "This transaction is not awaiting refund."
            });

        }

        const refundAmount = Number(transaction.refund_amount);

        // Credit customer wallet
        await connection.query(
            `
            UPDATE users
            SET wallet = wallet + ?
            WHERE id = ?
            `,
            [
                refundAmount,
                transaction.user_id
            ]
        );

        const providerReference =
            "REF-" + Date.now();

        // Mark refund completed
        await connection.query(
            `
            UPDATE transactions
            SET
                refund_status = 'refunded',
                refunded_at = NOW(),
                provider_reference = ?
            WHERE id = ?
            `,
            [
                providerReference,
                id
            ]
        );

        await connection.commit();

        // Notify customer
        createNotification(
            transaction.user_id,
            "Refund Successful",
            `₦${refundAmount.toLocaleString()} has been refunded to your wallet.`
        );

        const io = req.app.get("io");

        if (io) {

            io.to(`user_${transaction.user_id}`).emit(
                "newNotification",
                {
                    title: "Refund Successful",
                    message:
                        `₦${refundAmount.toLocaleString()} has been refunded to your wallet.`
                }
            );

        }

        return res.json({

            success: true,
            message: "Refund processed successfully.",
            refundAmount,
            reference: providerReference

        });

    } catch (error) {

        await connection.rollback();

        console.log(error);

        return res.status(500).json({
            success: false,
            message: error.message
        });

    } finally {

        connection.release();

    }

};


module.exports = {

    requestRefund,
    getRefundRequests,
    approveRefund

};