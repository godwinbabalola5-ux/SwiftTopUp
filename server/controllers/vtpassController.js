const vtpass = require("../services/vtpassService");
const { deductWallet } = require("../services/walletService");

const buyAirtime = async (req, res) => {

    const userId = req.user.id;

    const {
        serviceID,
        amount,
        phone
    } = req.body;

    if (!serviceID || !amount || !phone) {
        return res.status(400).json({
            success: false,
            message: "All fields are required."
        });
    }

    deductWallet(userId, amount, "airtime", async (err, reference) => {

        if (err) {
            return res.status(400).json({
                success: false,
                message: err.message
            });
        }

        try {

            const response = await vtpass.post("/pay", {

                request_id: reference,

                serviceID,

                amount,

                phone

            });

            const data = response.data;

if (data.content?.WrongBillersCode) {

    return res.status(400).json({
        success: false,
        message: data.content.error
    });

}

res.json({
    success: true,
    message: "Meter verified successfully.",
    customer: data.content
});
        } catch (error) {

            return res.status(500).json({

                success: false,

                error: error.response?.data || error.message

            });

        }

    });

};

module.exports = {
    buyAirtime
};