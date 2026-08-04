const db = require("../config/db");
const createNotification = require("../utils/createNotification");
const { rewardCashback } = require("./cashbackController");
const paymentEngine = require("../services/paymentEngine");


// ==========================================
// GET ELECTRICITY PROVIDERS
// ==========================================

const getDiscos = async (req, res) => {

    const discos = [

        {
            id: "ikeja-electric",
            name: "Ikeja Electric"
        },

        {
            id: "eko-electric",
            name: "Eko Electric"
        },

        {
            id: "abuja-electric",
            name: "Abuja Electric"
        },

        {
            id: "ibadan-electric",
            name: "Ibadan Electric"
        },

        {
            id: "kaduna-electric",
            name: "Kaduna Electric"
        },

        {
            id: "jos-electric",
            name: "Jos Electric"
        },

        {
            id: "kano-electric",
            name: "Kano Electric"
        },

        {
            id: "portharcourt-electric",
            name: "Port Harcourt Electric"
        },

        {
            id: "enugu-electric",
            name: "Enugu Electric"
        },

        {
            id: "benin-electric",
            name: "Benin Electric"
        }

    ];

    return res.json({

        success: true,

        discos

    });

};


// ==========================================
// BUY ELECTRICITY
// ==========================================

const buyElectricity = async (req, res) => {

    try {

        const userId = req.user.id;

        const {
            disco,
            meter_number,
            meter_type,
            amount
        } = req.body;


        // ==========================================
        // VALIDATE INPUT
        // ==========================================

        if (
            !disco ||
            !meter_number ||
            !meter_type ||
            !amount
        ) {

            return res.status(400).json({

                success: false,

                message: "All electricity payment fields are required."

            });

        }


        if (Number(amount) <= 0) {

            return res.status(400).json({

                success: false,

                message: "Amount must be greater than zero."

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

                message: "Insufficient wallet balance."

            });

        }


        // ==========================================
        // CREATE REQUEST ID
        // ==========================================

        const requestId = `EL${Date.now()}`;


        // ==========================================
        // PAYMENT ENGINE
        // ==========================================

        const response = await paymentEngine(

            "electricity",

            {

                request_id: requestId,

                serviceID: disco,

                billersCode: meter_number,

                variation_code: meter_type,

                amount: Number(amount),

                phone: user.phone,

                email: user.email

            }

        );


        // ==========================================
        // CHECK PAYMENT RESPONSE
        // ==========================================

        if (!response || response.data?.code !== "000") {

            return res.status(400).json({

                success: false,

                message:
                    response?.data?.response_description ||
                    "Electricity payment failed."

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
            VALUES (?,?,?,?,?,?,?,?)`,

            [

                userId,

                "electricity",

                Number(amount),

                "success",

                requestId,

                "Payment Engine",

                meter_number,

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

            "Electricity Payment",

            `You paid ₦${Number(amount).toLocaleString()} for meter ${meter_number}.`

        );


        // ==========================================
        // REAL-TIME NOTIFICATION
        // ==========================================

        const io = req.app.get("io");


        if (io) {

            io.to(`user_${userId}`).emit(

                "newNotification",

                {

                    title: "Electricity Payment",

                    message:
                        `You paid ₦${Number(amount).toLocaleString()} for meter ${meter_number}.`

                }

            );

        }


        // ==========================================
        // RESPONSE
        // ==========================================

        return res.json({

            success: true,

            message:
                "Electricity purchased successfully.",

            transactionId,

            data: response.data

        });

    } catch (error) {

        console.log(
            "========== ELECTRICITY ERROR =========="
        );

        console.log(
            error.response?.data ||
            error.message
        );

        console.log(
            "======================================="
        );


        return res.status(500).json({

            success: false,

            message:
                error.response?.data?.response_description ||
                error.message ||
                "Electricity payment failed."

        });

    }

};


module.exports = {

    getDiscos,

    buyElectricity

};