const crypto = require("crypto");
const db = require("../config/db");

const { creditWallet } = require("../services/walletService");
const { createTransaction } = require("../services/transactionService");

const paystackWebhook = async (req, res) => {

    // IMPORTANT: this must be computed against the ORIGINAL raw request
    // bytes Paystack sent, not JSON.stringify(req.body). Re-serializing
    // an already-parsed object can come out with different key ordering
    // or spacing than what Paystack actually signed — even a single
    // character of difference makes the signature check fail for every
    // genuine webhook, not just forged ones. req.rawBody is captured in
    // app.js specifically so this check has the real bytes to compare.
    const hash = crypto
        .createHmac("sha512", process.env.PAYSTACK_SECRET_KEY)
        .update(req.rawBody)
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

    const userId = payment.metadata?.userId;

    const amount = payment.amount / 100;

    const reference = payment.reference;

    if (!userId) {

        console.log(
            "WEBHOOK: charge.success with no metadata.userId — reference:",
            reference
        );

        return res.sendStatus(200);

    }

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
