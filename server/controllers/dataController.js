const db = require("../config/db");
const createNotification = require("../utils/createNotification");
const { rewardCashback } = require("./cashbackController");
const paymentEngine = require("../services/paymentEngine");

const getDataPlans = async (req, res) => {

    try {

        const { network } = req.params;

        const response = await paymentEngine(
            "dataPlans",
            { network }
        );

        return res.json({
            success: true,
            plans: response.data.content?.variations || []
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message
        });

    }

};

const buyData = async (req, res) => {

    try {

        const userId = req.user.id;

        const {
            network,
            phone,
            variation_code,
            amount
        } = req.body;

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

        if (Number(user.wallet) < Number(amount)) {

            return res.status(400).json({
                success: false,
                message: "Insufficient wallet balance."
            });

        }

        const requestId = "DT" + Date.now();

        const response = await paymentEngine(
            "data",
            {
                request_id: requestId,
                serviceID: `${network}-data`,
                billersCode: phone,
                variation_code,
                phone,
                email: user.email
            }
        );

        if (response.data.code !== "000") {

            return res.status(400).json({
                success: false,
                message: "Payment failed."
            });

        }

        const newBalance = Number(user.wallet) - Number(amount);

        await db.query(
            "UPDATE users SET wallet=? WHERE id=?",
            [newBalance, userId]
        );

        const [transactionResult] = await db.query(
            `INSERT INTO transactions
            (user_id,type,amount,status,reference,provider,customer,response)
            VALUES(?,?,?,?,?,?,?,?)`,
            [
                userId,
                "data",
                amount,
                "success",
                requestId,
                "Payment Engine",
                phone,
                JSON.stringify(response.data)
            ]
        );

        await rewardCashback(
            userId,
            transactionResult.insertId,
            Number(amount)
        );

        createNotification(
            userId,
            "Data Purchased",
            `You successfully purchased ${variation_code} for ${phone}.`
        );

        const io = req.app.get("io");

        io.to(`user_${userId}`).emit("newNotification", {
            title: "Data Purchased",
            message: `You successfully purchased ${variation_code} for ${phone}.`
        });

        return res.json({
            success: true,
            message: "Data purchased successfully.",
            data: response.data
        });

    } catch (error) {

        console.log(error);

        return res.status(500).json({
            success: false,
            message: error.message
        });

    }

};

module.exports = {
    getDataPlans,
    buyData
};