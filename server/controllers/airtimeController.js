const db = require("../config/db");
const createNotification = require("../utils/createNotification");
const { rewardCashback } = require("./cashbackController");
const paymentEngine = require("../services/paymentEngine");
const { deductWalletAtomic, creditWalletAtomic } = require("../services/walletService");

const buyAirtime = async (req, res) => {

    try {

        const { network, phone, amount } = req.body;
        const user = req.user;

        if (!network || !phone || !amount) {
            return res.status(400).json({
                success: false,
                message: "All fields are required."
            });
        }

        // ==========================================
        // CONFIRM USER EXISTS
        // ==========================================
        // (Balance is no longer checked here — deductWalletAtomic below
        // checks and deducts in one atomic step, so we don't trust a
        // balance value that could go stale between reading it and
        // acting on it.)

        const [users] = await db.query(
            "SELECT id FROM users WHERE id=?",
            [user.id]
        );

        if (users.length === 0) {
            return res.status(404).json({
                success: false,
                message: "User not found."
            });
        }

        const reference = "AT" + Date.now();

        // ==========================================
        // ATOMIC DEDUCTION — happens BEFORE we call the
        // provider, so we never charge the provider for
        // money we didn't actually manage to hold.
        // ==========================================

        try {
            await deductWalletAtomic(user.id, Number(amount));
        } catch (err) {
            return res.status(400).json({
                success: false,
                message: err.message // "Insufficient wallet balance."
            });
        }

        try {

            const response = await paymentEngine(
                "airtime",
                {
                    request_id: reference,
                    serviceID: network,
                    amount,
                    phone
                }
            );

            if (response.data.code !== "000") {

                // Provider failed — refund what we deducted.
                await creditWalletAtomic(user.id, Number(amount));

                return res.status(400).json({
                    success: false,
                    message: "Payment failed."
                });

            }

            const [insertResult] = await db.query(
                `INSERT INTO transactions
                (user_id,type,amount,status,reference,provider,customer,response)
                VALUES(?,?,?,?,?,?,?,?)`,
                [
                    user.id,
                    "airtime",
                    amount,
                    "success",
                    reference,
                    "Payment Engine",
                    phone,
                    JSON.stringify(response.data)
                ]
            );

            const transactionId = insertResult.insertId;

            // =======================================
            // Get Airtime Markup from Settings
            // =======================================

            db.query(
                "SELECT airtime_markup FROM settings LIMIT 1",
                (err, settingResult) => {

                    if (err) {
                        console.log(err);
                    }

                    const markup =
                        Number(settingResult?.[0]?.airtime_markup || 0);

                    const providerCost = Number(amount);
                    const customerAmount = providerCost + markup;
                    const profit = customerAmount - providerCost;

                    // Save Business Revenue
                    db.query(
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
                        VALUES (?,?,?,?,?,?)
                        `,
                        [
                            transactionId,
                            "airtime",
                            providerCost,
                            customerAmount,
                            profit,
                            reference
                        ]
                    );

                    // Update Business Wallet
                    db.query(
                        `
                        UPDATE business_wallet
                        SET
                            balance = balance + ?,
                            total_profit = total_profit + ?
                        WHERE id = 1
                        `,
                        [profit, profit]
                    );

                }
            );

            // Cashback
            rewardCashback(
                user.id,
                transactionId,
                Number(amount)
            );

            // Notification
            createNotification(
                user.id,
                "Airtime Purchased",
                `You successfully purchased ₦${Number(amount).toLocaleString()} airtime for ${phone}.`
            );

            const io = req.app.get("io");

            io.to(`user_${user.id}`).emit("newNotification", {
                title: "Airtime Purchased",
                message: `You successfully purchased ₦${Number(amount).toLocaleString()} airtime for ${phone}.`
            });

            return res.json({
                success: true,
                message: "Airtime purchased successfully.",
                data: response.data
            });

        } catch (error) {

            console.log(error);

            // Something failed after we'd already deducted the money
            // (provider threw, DB insert failed, etc.) — refund so the
            // customer isn't charged for a purchase that didn't go through.
            try {
                await creditWalletAtomic(user.id, Number(amount));
            } catch (refundError) {
                console.log("REFUND FAILED — needs manual review:", refundError);
            }

            return res.status(500).json({
                success: false,
                message: error.message
            });

        }

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message
        });

    }

};

module.exports = {
    buyAirtime
};