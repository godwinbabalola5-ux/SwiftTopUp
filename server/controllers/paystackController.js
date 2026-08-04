const paystack = require("../services/paystackService");
const { creditWallet } = require("../services/walletService");
const { createTransaction } = require("../services/transactionService");

// Initialize Payment
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

        const response = await paystack.post("/transaction/initialize", {

            email: user.email,

            amount: amount * 100,

            metadata: {

                userId: user.id,

                purpose: "Wallet Funding"

            }

        });

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


// Verify Payment
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

        const amount = payment.amount / 100;
        const userId = payment.metadata.userId;

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

            // ============================
            // Real-time Dashboard Update
            // ============================
            const io = req.app.get("io");

            io.emit("dashboardUpdated");

            io.to(`user_${userId}`).emit("newNotification", {
                title: "Wallet Funded",
                message: `₦${Number(amount).toLocaleString()} has been added to your wallet.`
            });

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