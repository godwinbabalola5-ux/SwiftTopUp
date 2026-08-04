const axios = require("axios");

const vtpassPayment = async (payload) => {

    const response = await axios.post(

        "https://sandbox.vtpass.com/api/pay",

        payload,

        {

            headers: {

                "api-key": process.env.VTPASS_API_KEY,

                "public-key": process.env.VTPASS_PUBLIC_KEY,

                "secret-key": process.env.VTPASS_SECRET_KEY,

                "Content-Type": "application/json"

            }

        }

    );

    return {

        success: true,

        data: response.data

    };

};

module.exports = {

    vtpassPayment

};