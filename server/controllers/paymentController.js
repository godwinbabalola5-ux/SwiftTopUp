const axios = require("axios");
const db = require("../config/db");
const createNotification = require("../utils/createNotification");
console.log(
    "PAYSTACK KEY LOADED:",
    process.env.PAYSTACK_SECRET_KEY
        ? "YES"
        : "NO"
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

        // Prevent req.body undefined error
        const { amount } = req.body || {};

        const numericAmount = Number(amount);

        if (!amount || !Number.isFinite(numericAmount) || numericAmount <= 0) {

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

        const response = await axios.post(

            "https://api.paystack.co/transaction/initialize",

            {
                email: user.email,
                amount: Math.round(numericAmount * 100),
                callback_url: "http://localhost:5173/payment/success"
            },

            {
                headers: {
                    Authorization:
                        `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,

                    "Content-Type": "application/json"
                }

            }

        );

        return res.json({

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

        error:
            error.response?.data || null

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

            "SELECT * FROM transactions WHERE reference = ?",

            [reference]

        );

        if (existingTransactions.length > 0) {

            return res.json({

                success: true,

                message: "Payment already processed."

            });

        }


        // ==========================================
        // VERIFY PAYMENT WITH PAYSTACK
        // ==========================================

        const paystackResponse = await axios.get(

            `https://api.paystack.co/transaction/verify/${reference}`,

            {

                headers: {

                    Authorization:
                        `Bearer ${process.env.PAYSTACK_SECRET_KEY}`

                }

            }

        );


        const payment = paystackResponse.data.data;


        if (payment.status !== "success") {

            return res.status(400).json({

                success: false,

                message: "Payment was not successful."

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
        // FIND USER
        // ==========================================

        const [users] = await db.query(

            "SELECT id FROM users WHERE email = ?",

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

            "UPDATE users SET wallet = wallet + ? WHERE id = ?",

            [
                amount,
                userId
            ]

        );


        // ==========================================
        // SAVE TRANSACTION
        // ==========================================

        await db.query(

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
        // DATABASE NOTIFICATION
        // ==========================================

        createNotification(

            userId,

            "Wallet Funded",

            `Your wallet has been funded with ₦${amount.toLocaleString()}.`

        );


        // ==========================================
        // SOCKET.IO NOTIFICATION
        // ==========================================

        const io = req.app.get("io");

        if (io) {

            io.to(`user_${userId}`).emit(

                "newNotification",

                {

                    title: "Wallet Funded",

                    message:
                        `₦${amount.toLocaleString()} has been added to your wallet.`

                }

            );

        }


        // ==========================================
        // SUCCESS
        // ==========================================

        return res.json({

            success: true,

            message: "Wallet funded successfully.",

            amount,

            reference

        });

    } catch (error) {

        console.log("========== PAYSTACK VERIFY ERROR ==========");
        console.log(
            error.response?.data ||
            error.message
        );
        console.log("===========================================");

        return res.status(500).json({

            success: false,

            message:
                error.response?.data?.message ||
                error.message ||
                "Payment verification failed."

        });

    }

};


module.exports = {

    initializePayment,

    verifyPayment

};