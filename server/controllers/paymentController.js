const axios = require("axios");
const db = require("../config/db");
const createNotification = require("../utils/createNotification");

console.log(
    "PAYSTACK KEY LOADED:",
    process.env.PAYSTACK_SECRET_KEY ? "YES" : "NO"
);

// ==========================================
// INITIALIZE PAYSTACK PAYMENT
// ==========================================

const initializePayment = async (req, res) => {
    try {
        const user = req.user;

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized."
            });
        }

        const { amount } = req.body || {};
        const numericAmount = Number(amount);

        if (
            !amount ||
            !Number.isFinite(numericAmount) ||
            numericAmount <= 0
        ) {
            return res.status(400).json({
                success: false,
                message: "Please provide a valid amount."
            });
        }

        // ==========================================
        // CHECK ADMIN FUNDING LIMITS
        // ==========================================

        const [settings] = await db.query(
            `SELECT minimum_funding, maximum_funding, maintenance_mode
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

        const minimumFunding = Number(settings[0].minimum_funding);
        const maximumFunding = Number(settings[0].maximum_funding);

        if (settings[0].maintenance_mode) {
            return res.status(503).json({
                success: false,
                message: "SwiftTopUp is currently under maintenance."
            });
        }

        if (numericAmount < minimumFunding) {
            return res.status(400).json({
                success: false,
                message: `Minimum funding amount is ₦${minimumFunding.toLocaleString()}.`
            });
        }

        if (numericAmount > maximumFunding) {
            return res.status(400).json({
                success: false,
                message: `Maximum funding amount is ₦${maximumFunding.toLocaleString()}.`
            });
        }

        // ==========================================
        // PAYSTACK DEBUG
        // ==========================================

        console.log("========== PAYMENT DEBUG ==========");
        console.log("USER EMAIL:", user.email);
        console.log("AMOUNT:", numericAmount);
        console.log("AMOUNT KOBO:", Math.round(numericAmount * 100));
        console.log(
            "PAYSTACK KEY EXISTS:",
            !!process.env.PAYSTACK_SECRET_KEY
        );
        console.log(
            "PAYSTACK KEY PREFIX:",
            process.env.PAYSTACK_SECRET_KEY?.substring(0, 5)
        );
        console.log("===================================");

        if (!process.env.PAYSTACK_SECRET_KEY) {
            return res.status(500).json({
                success: false,
                message: "Paystack secret key is not configured."
            });
        }

        // ==========================================
        // INITIALIZE PAYMENT WITH PAYSTACK
        // ==========================================

        const response = await axios.post(
            "https://api.paystack.co/transaction/initialize",
            {
                email: user.email,
                amount: Math.round(numericAmount * 100),

                // IMPORTANT:
                // Change this URL when the frontend is deployed.
                callback_url: "http://localhost:5173/payment/success"
            },
            {
                headers: {
                    Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
                    "Content-Type": "application/json"
                },
                timeout: 30000
            }
        );

        console.log("PAYSTACK INITIALIZE SUCCESS");
        console.log("REFERENCE:", response.data.data.reference);

        return res.status(200).json({
            success: true,
            message: "Payment initialized successfully.",
            data: response.data.data
        });

    } catch (error) {
        console.log("========== PAYSTACK INITIALIZE ERROR ==========");

        console.log("MESSAGE:", error.message);

        console.log(
            "STATUS:",
            error.response?.status
        );

        console.log(
            "PAYSTACK RESPONSE:",
            error.response?.data
        );

        console.log("===============================================");

        return res.status(500).json({
            success: false,
            message:
                error.response?.data?.message ||
                error.message ||
                "Unable to initialize payment.",

            error: error.response?.data || null
        });
    }
};


// ==========================================
// VERIFY PAYSTACK PAYMENT
// ==========================================

const verifyPayment = async (req, res) => {
    try {
        const { reference } = req.query;

        if (!reference) {
            return res.status(400).json({
                success: false,
                message: "Reference is required."
            });
        }

        // ==========================================
        // CHECK IF PAYMENT WAS ALREADY PROCESSED
        // ==========================================

        const [existingTransactions] = await db.query(
            `SELECT id, user_id, amount, status, reference
             FROM transactions
             WHERE reference = ?
             LIMIT 1`,
            [reference]
        );

        if (existingTransactions.length > 0) {
            return res.status(200).json({
                success: true,
                message: "Payment already processed.",
                amount: existingTransactions[0].amount,
                reference
            });
        }

        // ==========================================
        // VERIFY PAYMENT WITH PAYSTACK
        // ==========================================

        const paystackResponse = await axios.get(
            `https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`,
            {
                headers: {
                    Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`
                },
                timeout: 30000
            }
        );

        const payment = paystackResponse.data.data;

        if (!payment) {
            return res.status(400).json({
                success: false,
                message: "Invalid payment response from Paystack."
            });
        }

        // ==========================================
        // CHECK PAYMENT STATUS
        // ==========================================

        if (payment.status !== "success") {
            return res.status(400).json({
                success: false,
                message: "Payment was not successful.",
                status: payment.status
            });
        }

        // ==========================================
        // PAYMENT DETAILS
        // ==========================================

        const amount = Number(payment.amount) / 100;
        const email = payment.customer?.email;

        if (!email) {
            return res.status(400).json({
                success: false,
                message: "Customer email could not be verified."
            });
        }
        // ==========================================
// GET DEPOSIT FEE
// ==========================================

const [settings] = await db.query(
    `
    SELECT deposit_fee
    FROM settings
    WHERE id = 1
    LIMIT 1
    `
);

const depositFee = Number(settings[0]?.deposit_fee || 0);

// Amount credited to customer
const amountToCredit = amount - depositFee;

if (amountToCredit < 0) {
    return res.status(400).json({
        success: false,
        message: "Invalid deposit fee configuration."
    });
}

        // ==========================================
        // FIND USER
        // ==========================================

        const [users] = await db.query(
            `SELECT id, wallet
             FROM users
             WHERE email = ?
             LIMIT 1`,
            [email]
        );

        if (users.length === 0) {
            return res.status(404).json({
                success: false,
                message: "User not found."
            });
        }

        const userId = users[0].id;

        // ==========================================
// CREDIT WALLET
// ==========================================

await db.query(
`
UPDATE users
SET wallet = wallet + ?
WHERE id = ?
`,
[amountToCredit, userId]
);

// ==========================================
// SAVE TRANSACTION FIRST
// ==========================================

const [transactionResult] = await db.query(
`
INSERT INTO transactions
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
VALUES (?, ?, ?, ?, ?, ?, ?, ?)
`,
[
    userId,
    "fund",
    amount,
    "success",
    reference,
    "Paystack",
    email,
    JSON.stringify(payment)
]
);

// ==========================================
// SAVE BUSINESS REVENUE
// ==========================================

await db.query(
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
VALUES (?, ?, ?, ?, ?, ?)
`,
[
    transactionResult.insertId,
    "deposit",
    amountToCredit,
    amount,
    depositFee,
    reference
]
);

// ==========================================
// UPDATE BUSINESS WALLET
// ==========================================

await db.query(
`
UPDATE business_wallet
SET
    balance = balance + ?,
    total_profit = total_profit + ?
WHERE id = 1
`,
[
    depositFee,
    depositFee
]
);
    

        // ==========================================
// DATABASE NOTIFICATION
// ==========================================

await createNotification(
    userId,
    "Wallet Funded",
    `Your wallet has been funded with ₦${amountToCredit.toLocaleString()}. Deposit fee: ₦${depositFee.toLocaleString()}.`
);

// ==========================================
// SOCKET EVENTS
// ==========================================

const io = req.app.get("io");

if (io) {

    // User notification
    io.to(`user_${userId}`).emit("newNotification", {
        title: "Wallet Funded",
        message: `₦${amountToCredit.toLocaleString()} has been added to your wallet after a ₦${depositFee.toLocaleString()} deposit fee.`
    });

    // Refresh every admin page instantly
    io.emit("newTransaction");
    io.emit("dashboardUpdated");
    io.emit("businessWalletUpdated");
    io.emit("revenueUpdated");
}

        // ==========================================
        // SUCCESS RESPONSE
        // ==========================================

        return res.status(200).json({
            success: true,
            message: "Wallet funded successfully.",
            amount: amountToCredit,
            reference
        });

    } catch (error) {
        console.log("========== PAYSTACK VERIFY ERROR ==========");

        console.log(
            "MESSAGE:",
            error.message
        );

        console.log(
            "STATUS:",
            error.response?.status
        );

        console.log(
            "PAYSTACK RESPONSE:",
            error.response?.data
        );

        console.log("==========================================");

        return res.status(500).json({
            success: false,
            message:
                error.response?.data?.message ||
                error.message ||
                "Payment verification failed."
        });
    }
};


// ==========================================
// EXPORT CONTROLLERS
// ==========================================

module.exports = {
    initializePayment,
    verifyPayment
};