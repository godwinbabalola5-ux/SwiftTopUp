const db = require("../config/db");
const createNotification = require("../utils/createNotification");
const { rewardCashback } = require("./cashbackController");
const paymentEngine = require("../services/paymentEngine");
const { deductWalletAtomic, creditWalletAtomic } = require("../services/walletService");

// ==========================================
// GET DATA PLANS
// ==========================================

const getDataPlans = async (req, res) => {

    try {

        const { network } = req.params;

        const response = await paymentEngine(
            "dataPlans",
            { network }
        );

        return res.json({
            success: true,
            // VTpass's own docs are inconsistent about this key — most
            // endpoints return "variations", but a few real responses
            // come back as "varations" (their typo, not ours). Checking
            // both means we don't break if VTpass returns either.
            plans:
                response.data.content?.variations ||
                response.data.content?.varations ||
                []
        });

    } catch (error) {

        console.log("GET DATA PLANS ERROR:", error);

        return res.status(500).json({
            success: false,
            message: "Unable to load data plans."
        });

    }

};


// ==========================================
// BUY DATA
// ==========================================

const buyData = async (req, res) => {

    // Tracks whether we've already taken money out of the wallet in this
    // request, so the catch-all error handler at the bottom knows whether
    // a refund is needed (only refund if we actually deducted first).
    let deducted = false;
    let deductedUserId = null;
    let deductedAmount = 0;

    try {

        const userId = req.user.id;

        const {
            network,
            phone,
            variation_code,
            amount
        } = req.body;

        // ==========================================
        // VALIDATE INPUT
        // ==========================================

        if (
            !network ||
            !phone ||
            !variation_code ||
            !amount
        ) {

            return res.status(400).json({
                success: false,
                message: "Please provide all required information."
            });

        }

        // ==========================================
        // GET USER
        // ==========================================

        const [users] = await db.query(
            "SELECT * FROM users WHERE id = ?",
            [userId]
        );

        if (users.length === 0) {

            return res.status(404).json({
                success: false,
                message: "User not found."
            });

        }

        const user = users[0];

        // ==========================================
        // GET DATA MARKUP
        // ==========================================

        const [settings] = await db.query(
            `SELECT
                data_markup,
                maintenance_mode,
                data_enabled
             FROM settings
             WHERE id = 1
             LIMIT 1`
        );

        if (settings.length === 0) {

            return res.status(500).json({
                success: false,
                message: "System settings could not be loaded."
            });

        }

        const dataSettings = settings[0];

        // ==========================================
        // CHECK SERVICE STATUS
        // ==========================================

        if (!dataSettings.data_enabled) {

            return res.status(503).json({
                success: false,
                message: "Data service is currently unavailable."
            });

        }

        if (dataSettings.maintenance_mode) {

            return res.status(503).json({
                success: false,
                message: "SwiftTopUp is currently under maintenance."
            });

        }

        // ==========================================
        // CALCULATE PRICE
        // ==========================================

        const providerAmount = Number(amount);

        const markup = Number(
            dataSettings.data_markup || 0
        );

        const customerAmount = providerAmount + markup;

        // ==========================================
        // ATOMIC WALLET DEDUCTION
        // ==========================================
        // Deduct BEFORE calling the provider, and do it as one atomic
        // conditional SQL statement (checks balance and deducts in the
        // same query) instead of reading the balance separately and
        // trusting it — that older pattern let two near-simultaneous
        // requests both pass the check and both deduct, pushing the
        // wallet negative.

        try {
            await deductWalletAtomic(userId, customerAmount);
            deducted = true;
            deductedUserId = userId;
            deductedAmount = customerAmount;
        } catch (err) {
            return res.status(400).json({
                success: false,
                message: err.message // "Insufficient wallet balance."
            });
        }

        // ==========================================
        // CREATE REQUEST ID
        // ==========================================

        const requestId = "DT" + Date.now();

        // ==========================================
        // PROCESS DATA PURCHASE
        // ==========================================

        const response = await paymentEngine(
            "data",
            {
                request_id: requestId,
                serviceID: `${network}-data`,
                billersCode: phone,
                variation_code,
                phone,
                email: user.email
            }
        );

        if (
            !response ||
            !response.data ||
            response.data.code !== "000"
        ) {

            // Provider failed — refund what we deducted.
            await creditWalletAtomic(userId, customerAmount);
            deducted = false;

            return res.status(400).json({
                success: false,
                message: "Data purchase failed."
            });

        }

        // ==========================================
        // SAVE TRANSACTION
        // ==========================================

        const [transactionResult] = await db.query(
            `INSERT INTO transactions
            (
                user_id,
                type,
                amount,
                status,
                reference,
                provider,
                customer,
                response
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                userId,
                "data",
                customerAmount,
                "success",
                requestId,
                "Payment Engine",
                phone,
                JSON.stringify(response.data)
            ]
        );

        // ==========================================
        // RECORD BUSINESS PROFIT
        // ==========================================

        await db.query(
            `INSERT INTO business_revenue
            (
                transaction_id,
                service_type,
                provider_cost,
                customer_amount,
                profit,
                reference
            )
            VALUES (?, ?, ?, ?, ?, ?)`,
            [
                transactionResult.insertId,
                "data",
                providerAmount,
                customerAmount,
                markup,
                requestId
            ]
        );
        await db.query(
    `
    UPDATE business_wallet
    SET
        balance = balance + ?,
        total_profit = total_profit + ?
    WHERE id = 1
    `,
    [markup, markup]
);

        // ==========================================
        // CASHBACK
        // ==========================================

        await rewardCashback(
            userId,
            transactionResult.insertId,
            customerAmount
        );

        // ==========================================
        // NOTIFICATION
        // ==========================================

        createNotification(
            userId,
            "Data Purchased",
            `You successfully purchased ${variation_code} for ${phone}.`
        );

        // ==========================================
        // SOCKET NOTIFICATION
        // ==========================================

        const io = req.app.get("io");

        if (io) {

            io.to(`user_${userId}`).emit(
                "newNotification",
                {
                    title: "Data Purchased",
                    message:
                        `You successfully purchased ${variation_code} for ${phone}.`
                }
            );

        }

        // ==========================================
        // SUCCESS
        // ==========================================

        return res.json({

            success: true,

            message: "Data purchased successfully.",

            data: response.data,

            pricing: {
                provider_cost: providerAmount,
                markup,
                customer_amount: customerAmount
            }

        });

    } catch (error) {

        console.log("BUY DATA ERROR:", error);

        // Something failed after we'd already deducted the money —
        // refund so the customer isn't charged for a purchase that
        // didn't go through.
        if (deducted) {
            try {
                await creditWalletAtomic(deductedUserId, deductedAmount);
            } catch (refundError) {
                console.log("REFUND FAILED — needs manual review:", refundError);
            }
        }

        return res.status(500).json({
            success: false,
            message: error.message || "Data purchase failed."
        });

    }

};


module.exports = {
    getDataPlans,
    buyData
};