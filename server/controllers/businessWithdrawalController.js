const db = require("../config/db");
const crypto = require("crypto");

// ==========================================
// REQUEST BUSINESS WITHDRAWAL
// ==========================================

const requestWithdrawal = async (req, res) => {

    try {

        const {
            amount,
            bank_name,
            account_name,
            account_number
        } = req.body;

        if (
            !amount ||
            !bank_name ||
            !account_name ||
            !account_number
        ) {

            return res.status(400).json({
                success: false,
                message: "All fields are required."
            });

        }

        const withdrawalAmount = Number(amount);

        if (
            !Number.isFinite(withdrawalAmount) ||
            withdrawalAmount <= 0
        ) {

            return res.status(400).json({
                success: false,
                message: "Invalid withdrawal amount."
            });

        }

        // ==========================================
        // CHECK BUSINESS WALLET
        // ==========================================

        const [wallet] = await db.query(
            `
            SELECT balance
            FROM business_wallet
            WHERE id = 1
            LIMIT 1
            `
        );

        if (wallet.length === 0) {

            return res.status(404).json({
                success: false,
                message: "Business wallet not found."
            });

        }

        if (
            Number(wallet[0].balance) <
            withdrawalAmount
        ) {

            return res.status(400).json({
                success: false,
                message: "Insufficient business balance."
            });

        }

        // ==========================================
        // GENERATE REFERENCE
        // ==========================================

        const reference =
            "BW" +
            Date.now() +
            crypto.randomBytes(3).toString("hex");

        // ==========================================
        // CREATE WITHDRAWAL REQUEST
        // ==========================================

        await db.query(
            `
            INSERT INTO business_withdrawals
            (
                amount,
                bank_name,
                account_name,
                account_number,
                reference,
                status
            )
            VALUES (?, ?, ?, ?, ?, 'pending')
            `,
            [
                withdrawalAmount,
                bank_name,
                account_name,
                account_number,
                reference
            ]
        );

        return res.json({

            success: true,

            message:
                "Withdrawal request submitted.",

            reference

        });

    } catch (err) {

        console.error(
            "REQUEST WITHDRAWAL ERROR:",
            err
        );

        return res.status(500).json({

            success: false,

            message: err.message

        });

    }

};


// ==========================================
// GET ALL WITHDRAWALS
// ==========================================

const getWithdrawals = async (req, res) => {

    try {

        const [rows] = await db.query(
            `
            SELECT *
            FROM business_withdrawals
            ORDER BY created_at DESC
            `
        );

        return res.json({

            success: true,

            withdrawals: rows

        });

    } catch (err) {

        console.error(
            "GET WITHDRAWALS ERROR:",
            err
        );

        return res.status(500).json({

            success: false,

            message: err.message

        });

    }

};


// ==========================================
// APPROVE WITHDRAWAL
// ==========================================

const approveWithdrawal = async (req, res) => {

    try {

        const { id } = req.params;

        // ==========================================
        // FIND WITHDRAWAL
        // ==========================================

        const [rows] = await db.query(
            `
            SELECT *
            FROM business_withdrawals
            WHERE id = ?
            LIMIT 1
            `,
            [id]
        );

        if (rows.length === 0) {

            return res.status(404).json({

                success: false,

                message: "Withdrawal not found."

            });

        }

        const withdrawal = rows[0];

        // ==========================================
        // CHECK STATUS
        // ==========================================

        if (withdrawal.status !== "pending") {

            return res.status(400).json({

                success: false,

                message:
                    "Withdrawal has already been processed."

            });

        }

        const withdrawalAmount =
            Number(withdrawal.amount);

        // ==========================================
        // CHECK BUSINESS WALLET AGAIN
        // ==========================================

        const [wallet] = await db.query(
            `
            SELECT balance
            FROM business_wallet
            WHERE id = 1
            LIMIT 1
            `
        );

        if (wallet.length === 0) {

            return res.status(404).json({

                success: false,

                message:
                    "Business wallet not found."

            });

        }

        if (
            Number(wallet[0].balance) <
            withdrawalAmount
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Insufficient business balance."

            });

        }

        // ==========================================
        // DEDUCT BUSINESS BALANCE
        // ==========================================

        await db.query(
            `
            UPDATE business_wallet
            SET
                balance = balance - ?,
                total_withdrawn =
                    total_withdrawn + ?,
                updated_at = CURRENT_TIMESTAMP
            WHERE id = 1
            `,
            [
                withdrawalAmount,
                withdrawalAmount
            ]
        );

        // ==========================================
        // MARK WITHDRAWAL AS APPROVED
        // ==========================================

        await db.query(
            `
            UPDATE business_withdrawals
            SET status = 'approved'
            WHERE id = ?
            `,
            [id]
        );

        // ==========================================
        // REAL-TIME UPDATE
        // ==========================================

        const io = req.app.get("io");

        if (io) {

            io.emit(
                "businessWalletUpdated"
            );

            io.emit(
                "withdrawalUpdated"
            );

        }

        return res.json({

            success: true,

            message:
                "Withdrawal approved successfully."

        });

    } catch (err) {

        console.error(
            "APPROVE WITHDRAWAL ERROR:",
            err
        );

        return res.status(500).json({

            success: false,

            message: err.message

        });

    }

};


// ==========================================
// REJECT WITHDRAWAL
// ==========================================

const rejectWithdrawal = async (req, res) => {

    try {

        const { id } = req.params;

        // ==========================================
        // FIND WITHDRAWAL
        // ==========================================

        const [rows] = await db.query(
            `
            SELECT status
            FROM business_withdrawals
            WHERE id = ?
            LIMIT 1
            `,
            [id]
        );

        if (rows.length === 0) {

            return res.status(404).json({

                success: false,

                message:
                    "Withdrawal not found."

            });

        }

        // ==========================================
        // CHECK STATUS
        // ==========================================

        if (rows[0].status !== "pending") {

            return res.status(400).json({

                success: false,

                message:
                    "Withdrawal has already been processed."

            });

        }

        // ==========================================
        // MARK AS REJECTED
        // ==========================================

        await db.query(
            `
            UPDATE business_withdrawals
            SET status = 'rejected'
            WHERE id = ?
            `,
            [id]
        );

        // ==========================================
        // REAL-TIME UPDATE
        // ==========================================

        const io = req.app.get("io");

        if (io) {

            io.emit(
                "withdrawalUpdated"
            );

        }

        return res.json({

            success: true,

            message:
                "Withdrawal rejected successfully."

        });

    } catch (err) {

        console.error(
            "REJECT WITHDRAWAL ERROR:",
            err
        );

        return res.status(500).json({

            success: false,

            message: err.message

        });

    }

};


// ==========================================
// EXPORT
// ==========================================

module.exports = {

    requestWithdrawal,
    getWithdrawals,
    approveWithdrawal,
    rejectWithdrawal

};