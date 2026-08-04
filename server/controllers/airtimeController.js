const db = require("../config/db");
const createNotification = require("../utils/createNotification");
const { rewardCashback } = require("./cashbackController");
const paymentEngine = require("../services/paymentEngine");

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

        db.query(
            "SELECT * FROM users WHERE id=?",
            [user.id],
            async (err, results) => {

                if (err) {
                    return res.status(500).json({
                        success: false,
                        message: err.message
                    });
                }

                const currentUser = results[0];

                if (!currentUser) {
                    return res.status(404).json({
                        success: false,
                        message: "User not found."
                    });
                }

                if (Number(currentUser.wallet) < Number(amount)) {
                    return res.status(400).json({
                        success: false,
                        message: "Insufficient wallet balance."
                    });
                }

                const reference = "AT" + Date.now();

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
                        return res.status(400).json({
                            success: false,
                            message: "Payment failed."
                        });
                    }

                    db.query(
                        "UPDATE users SET wallet = wallet - ? WHERE id=?",
                        [amount, user.id],
                        (err) => {

                            if (err) {
                                return res.status(500).json({
                                    success: false,
                                    message: err.message
                                });
                            }

                            db.query(
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
                                ],
                                (err, result) => {

                                    if (err) {
                                        return res.status(500).json({
                                            success: false,
                                            message: err.message
                                        });
                                    }

                                    const transactionId = result.insertId;

                                    rewardCashback(
                                        user.id,
                                        transactionId,
                                        Number(amount)
                                    );

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

                                }
                            );

                        }
                    );

                } catch (error) {

                    console.log(error);

                    return res.status(500).json({
                        success: false,
                        message: error.message
                    });

                }

            }
        );

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