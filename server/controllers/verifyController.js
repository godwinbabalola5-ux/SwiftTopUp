const vtpass = require("../services/vtpassService");

const verifyMeter = async (req, res) => {

    try {

        const {
            billersCode,
            serviceID,
            type
        } = req.body;

        if (!billersCode || !serviceID || !type) {

            return res.status(400).json({
                success: false,
                message: "Billers code, service ID and meter type are required."
            });

        }

        const response = await vtpass.post("/merchant-verify", {

            billersCode,
            serviceID,
            type

        });

        const data = response.data;

        if (data.content?.WrongBillersCode) {

            return res.status(400).json({

                success: false,

                message: data.content.error

            });

        }

        return res.status(200).json({

            success: true,

            message: "Meter verified successfully.",

            customer: {

                name: data.content.Customer_Name,

                meterNumber: data.content.Meter_Number,

                address: data.content.Address,

                meterType: data.content.Meter_Type,

                accountType: data.content.Customer_Account_Type,

                canVend: data.content.Can_Vend

            }

        });

    } catch (error) {

        console.log("========== VERIFY ERROR ==========");
        console.log(error.response?.data || error.message);

        return res.status(500).json({

            success: false,

            error: error.response?.data || error.message

        });

    }

};

module.exports = {
    verifyMeter
};