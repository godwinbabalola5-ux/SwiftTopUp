const crypto = require("crypto");
const db = require("../config/db");

const { creditWallet } = require("../services/walletService");
const { createTransaction } = require("../services/transactionService");

const paystackWebhook = async (req, res) => {

    const hash = crypto
        .createHmac("sha512", process.env.PAYSTACK_SECRET_KEY)
        .update(JSON.stringify(req.body))
        .digest("hex");

    if (hash !== req.headers["x-paystack-signature"]) {

        return res.status(401).json({
            success: false,
            message: "Invalid signature."
        });

    }

    const event = req.body;

    if (event.event !== "charge.success") {

        return res.sendStatus(200);

    }

    const payment = event.data;

    const userId = payment.metadata.userId;

    const amount = payment.amount / 100;

    const reference = payment.reference;

    db.query(
        "SELECT * FROM transactions WHERE reference = ?",
        [reference],
        (err, results) => {

            if (err) {

                console.log(err);

                return res.sendStatus(500);

            }

            // Prevent duplicate funding
            if (results.length > 0) {

                console.log("Duplicate webhook ignored:", reference);

                return res.sendStatus(200);

            }

            creditWallet(userId, amount, (err) => {

                if (err) {

                    console.log(err);

                    return res.sendStatus(500);

                }

                createTransaction(
                    userId,
                    "fund",
                    amount,
                    reference,
                    "success",
                    () => {}
                );

                console.log("Wallet credited successfully:", reference);

                return res.sendStatus(200);

            });

        }

    );

};

module.exports = {
    paystackWebhook
};