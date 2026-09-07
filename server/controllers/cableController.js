const db = require("../config/db");
const createNotification = require("../utils/createNotification");
const { rewardCashback } = require("./cashbackController");
const paymentEngine = require("../services/paymentEngine");
const { deductWalletAtomic, creditWalletAtomic } = require("../services/walletService");


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

            // Same VTpass inconsistency as data plans — check both
            // spellings so we don't break on either response shape.
            plans:
                response.data?.content?.variations ||
                response.data?.content?.varations ||
                []

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

    // Tracks whether we've already taken money out of the wallet in this
    // request, so any failure branch below knows whether a refund is needed.
    let deducted = false;
    let deductedUserId = null;
    let deductedAmount = 0;

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
        // ATOMIC WALLET DEDUCTION
        // ==========================================
        // Deduct BEFORE calling the provider, atomically, so two
        // near-simultaneous requests can't both pass a balance check
        // and both deduct.

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

            // Provider failed — refund what we deducted.
            await creditWalletAtomic(userId, Number(amount));
            deducted = false;

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

            // Provider took the money but didn't actually deliver the
            // subscription — refund the customer.
            await creditWalletAtomic(userId, Number(amount));
            deducted = false;

            return res.status(400).json({

                success: false,

                message:
                    response.data
                        ?.response_description ||
                    "Cable subscription was not delivered."

            });

        }


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

        // NOTE: same as electricityController.js — no markup/profit is
        // currently calculated for cable purchases, so there's nothing
        // to record in business_wallet yet. The old code here referenced
        // an undefined `profit` variable, which threw a ReferenceError
        // right after every successful payment (money already taken,
        // transaction already saved), got swallowed by the catch block
        // below, and returned a false "subscription failed" to the
        // customer even though it succeeded. If you want a cable markup,
        // mirror the provider-cost/customer-amount/markup pattern in
        // dataController.js.


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

        // Something failed after we'd already deducted the money —
        // refund so the customer isn't charged for a subscription that
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