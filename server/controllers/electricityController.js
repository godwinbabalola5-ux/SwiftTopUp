const db = require("../config/db");
const createNotification = require("../utils/createNotification");
const { rewardCashback } = require("./cashbackController");
const paymentEngine = require("../services/paymentEngine");
const { deductWalletAtomic, creditWalletAtomic } = require("../services/walletService");


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

    // Tracks whether we've already taken money out of the wallet in this
    // request, so the catch-all error handler at the bottom knows whether
    // a refund is needed.
    let deducted = false;
    let deductedUserId = null;
    let deductedAmount = 0;

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
        // ATOMIC WALLET DEDUCTION
        // ==========================================
        // Deduct BEFORE calling the provider, atomically (checks balance
        // and deducts in one SQL statement) so two near-simultaneous
        // requests can't both pass a balance check and both deduct.

        try {
            await deductWalletAtomic(userId, Number(amount));
            deducted = true;
            deductedUserId = userId;
            deductedAmount = Number(amount);
        } catch (err) {
            return res.status(400).json({
                success: false,
                message: err.message // "Insufficient wallet balance."
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

            // Provider failed — refund what we deducted.
            await creditWalletAtomic(userId, Number(amount));
            deducted = false;

            return res.status(400).json({

                success: false,

                message:
                    response?.data?.response_description ||
                    "Electricity payment failed."

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

        // NOTE: unlike airtime/data, there's currently no markup/profit
        // calculated for electricity purchases (amount is passed straight
        // through to the provider), so there's nothing to record in
        // business_wallet yet. The old code here referenced an undefined
        // `profit` variable, which threw a ReferenceError on every
        // successful electricity payment — right after the money had
        // already been taken and the transaction saved as "success" —
        // and that error was swallowed by the catch block below,
        // returning a false "payment failed" to the customer even though
        // it had gone through. If you want a markup on electricity,
        // add the same provider-cost/customer-amount/markup calculation
        // that dataController.js uses, then insert into business_revenue
        // and update business_wallet like that file does.


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