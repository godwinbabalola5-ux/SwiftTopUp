const db = require("../config/db");
const createNotification = require("../utils/createNotification");
const { rewardCashback } = require("./cashbackController");
const paymentEngine = require("../services/paymentEngine");


// ==========================================
// GET CABLE PROVIDERS
// ==========================================

const getProviders = async (req, res) => {

    const providers = [

        {
            id: "dstv",
            name: "DSTV"
        },

        {
            id: "gotv",
            name: "GOtv"
        },

        {
            id: "startimes",
            name: "StarTimes"
        }

    ];

    return res.json({

        success: true,

        providers

    });

};


// ==========================================
// GET CABLE PLANS
// ==========================================

const getPlans = async (req, res) => {

    try {

        const { provider } = req.params;

        if (!provider) {

            return res.status(400).json({

                success: false,

                message: "Cable provider is required."

            });

        }

        const response = await paymentEngine(

            "cablePlans",

            {
                provider
            }

        );

        return res.json({

            success: true,

            plans:
                response.data?.content?.variations || []

        });

    } catch (error) {

        console.log(
            "========== CABLE PLANS ERROR =========="
        );

        console.log(error.message);

        console.log(
            "======================================="
        );

        return res.status(500).json({

            success: false,

            message:
                error.message ||
                "Unable to fetch cable plans."

        });

    }

};


// ==========================================
// BUY CABLE SUBSCRIPTION
// ==========================================

const buyCable = async (req, res) => {

    try {

        const userId = req.user.id;

        const {
            provider,
            smartcard,
            variation_code,
            amount
        } = req.body;


        // ==========================================
        // VALIDATE INPUT
        // ==========================================

        if (
            !provider ||
            !smartcard ||
            !variation_code ||
            !amount
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "All cable subscription fields are required."

            });

        }


        if (Number(amount) <= 0) {

            return res.status(400).json({

                success: false,

                message:
                    "Amount must be greater than zero."

            });

        }


        // ==========================================
        // GET USER
        // ==========================================

        const [users] = await db.query(

            "SELECT * FROM users WHERE id=?",

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
        // CHECK WALLET
        // ==========================================

        if (Number(user.wallet) < Number(amount)) {

            return res.status(400).json({

                success: false,

                message:
                    "Insufficient wallet balance."

            });

        }


        // ==========================================
        // CREATE REQUEST ID
        // ==========================================

        const requestId = `CB${Date.now()}`;


        // ==========================================
        // PAYMENT ENGINE
        // ==========================================

        const response = await paymentEngine(

            "cable",

            {

                request_id: requestId,

                serviceID: provider,

                billersCode: smartcard,

                variation_code,

                phone: user.phone,

                email: user.email

            }

        );


        // ==========================================
        // CHECK PROVIDER RESPONSE
        // ==========================================

        if (
            !response ||
            response.data?.code !== "000"
        ) {

            return res.status(400).json({

                success: false,

                message:
                    response?.data
                        ?.response_description ||
                    "Cable subscription failed."

            });

        }


        // ==========================================
        // CHECK DELIVERY STATUS
        // ==========================================

        const transactionStatus =
            response.data
                ?.content
                ?.transactions
                ?.status;


        if (
            transactionStatus &&
            transactionStatus !== "delivered"
        ) {

            return res.status(400).json({

                success: false,

                message:
                    response.data
                        ?.response_description ||
                    "Cable subscription was not delivered."

            });

        }


        // ==========================================
        // DEDUCT WALLET
        // ==========================================

        await db.query(

            "UPDATE users SET wallet = wallet - ? WHERE id=?",

            [
                Number(amount),
                userId
            ]

        );


        // ==========================================
        // SAVE TRANSACTION
        // ==========================================

        const [transactionResult] =
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
                VALUES (?,?,?,?,?,?,?,?)`,

                [

                    userId,

                    "cable",

                    Number(amount),

                    "success",

                    requestId,

                    provider,

                    smartcard,

                    JSON.stringify(response.data)

                ]

            );


        const transactionId =
            transactionResult.insertId;


        // ==========================================
        // CASHBACK
        // ==========================================

        await rewardCashback(

            userId,

            transactionId,

            Number(amount)

        );


        // ==========================================
        // DATABASE NOTIFICATION
        // ==========================================

        createNotification(

            userId,

            "Cable Subscription",

            `You successfully subscribed to ${provider.toUpperCase()} using smartcard ${smartcard}.`

        );


        // ==========================================
        // REAL-TIME NOTIFICATION
        // ==========================================

        const io = req.app.get("io");


        if (io) {

            io.to(`user_${userId}`).emit(

                "newNotification",

                {

                    title:
                        "Cable Subscription",

                    message:
                        `You successfully subscribed to ${provider.toUpperCase()} using smartcard ${smartcard}.`

                }

            );

        }


        // ==========================================
        // SUCCESS RESPONSE
        // ==========================================

        return res.json({

            success: true,

            message:
                "Cable subscription successful.",

            transactionId,

            data: response.data

        });

    } catch (error) {

        console.log(
            "========== CABLE ERROR =========="
        );

        console.log(
            error.response?.data ||
            error.message
        );

        console.log(
            "================================="
        );


        return res.status(500).json({

            success: false,

            message:
                error.response?.data
                    ?.response_description ||
                error.message ||
                "Cable subscription failed."

        });

    }

};


module.exports = {

    getProviders,

    getPlans,

    buyCable

};