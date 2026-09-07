const paystack = require("../services/paystackService");
const { creditWallet } = require("../services/walletService");
const { createTransaction } = require("../services/transactionService");
const db = require("../config/db");

// =====================================
// INITIALIZE PAYMENT
// =====================================

const initializePayment = async (req, res) => {

    try {

        const user = req.user;
        const { amount } = req.body;

        if (!amount || amount <= 0) {

            return res.status(400).json({
                success: false,
                message: "Please enter a valid amount."
            });

        }

        const response = await paystack.post(
            "/transaction/initialize",
            {
                email: user.email,
                amount: amount * 100,
                metadata: {
                    userId: user.id,
                    purpose: "Wallet Funding"
                }
            }
        );

        return res.json({
            success: true,
            message: "Payment initialized successfully.",
            data: response.data.data
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            error: error.response?.data || error.message
        });

    }

};


// =====================================
// VERIFY PAYMENT
// =====================================

const verifyPayment = async (req, res) => {

    try {

        const { reference } = req.params;

        const response = await paystack.get(
            `/transaction/verify/${reference}`
        );

        const payment = response.data.data;

        if (payment.status !== "success") {

            return res.status(400).json({
                success: false,
                message: "Payment not successful."
            });

        }

        const amount = Number(payment.amount) / 100;
        const userId = payment.metadata.userId;

        // =====================================
        // Calculate Deposit Fee
        // =====================================

        const [settings] = await db.promise().query(
            "SELECT deposit_fee FROM settings LIMIT 1"
        );

        const depositFee = Number(settings[0].deposit_fee || 0);

        const providerCost = amount;

        const customerAmount = amount + depositFee;

        const profit = depositFee;

        // =====================================
        // Credit User Wallet
        // =====================================

        creditWallet(userId, amount, async (err) => {

            if (err) {

                return res.status(500).json({
                    success: false,
                    message: err.message
                });

            }

            createTransaction(
                userId,
                "fund",
                amount,
                payment.reference,
                "success",
                () => {}
            );

            // =====================================
            // Save Revenue
            // =====================================

            await db.promise().query(
                `
                INSERT INTO business_revenue
                (
                    transaction_id,
                    service_type,
                    provider_cost,
                    customer_amount,
                    profit,
                    reference
                )
                VALUES
                (
                    NULL,
                    'deposit',
                    ?,
                    ?,
                    ?,
                    ?
                )
                `,
                [
                    providerCost,
                    customerAmount,
                    profit,
                    payment.reference
                ]
            );

            // =====================================
            // Update Business Wallet
            // =====================================

            await db.promise().query(
                `
                UPDATE business_wallet
                SET
                    balance = balance + ?,
                    total_profit = total_profit + ?
                WHERE id = 1
                `,
                [
                    profit,
                    profit
                ]
            );

            // =====================================
            // Dashboard Update
            // =====================================

            const io = req.app.get("io");

            io.emit("dashboardUpdated");

            io.emit("newTransaction");

            io.to(`user_${userId}`).emit(
                "newNotification",
                {
                    title: "Wallet Funded",
                    message: `₦${amount.toLocaleString()} has been added to your wallet.`
                }
            );

            return res.json({
                success: true,
                message: "Wallet funded successfully.",
                amount,
                reference: payment.reference
            });

        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            error: error.response?.data || error.message
        });

    }

};

module.exports = {
    initializePayment,
    verifyPayment
};