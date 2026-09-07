const axios = require("axios");

// Maps the network/provider names your frontend already sends
// (mtn, glo, airtel, dstv, gotv, ...) to VTpass's actual serviceID
// values, since VTpass doesn't use the same short names you do.
const SERVICE_ID_MAP = {

    // Data networks
    mtn: "mtn-data",
    glo: "glo-data",
    airtel: "airtel-data",
    "9mobile": "etisalat-data",
    etisalat: "etisalat-data",

    // Cable providers
    dstv: "dstv",
    gotv: "gotv",
    startimes: "startimes"

};

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

// ==========================================
// GET SERVICE VARIATIONS (data plans, cable bouquets, etc.)
// ==========================================
// This is a completely different VTpass endpoint from the payment one
// above — it's a GET request, not a POST, and it's what actually
// returns the list of plans/bouquets for a given network or provider.
// Without this, paymentEngine had no real way to fetch plans at all —
// it was calling the /api/pay purchase endpoint for this too, which
// VTpass doesn't understand as a "give me your plans" request.
const getServiceVariations = async (rawServiceId) => {

    const serviceID =
        SERVICE_ID_MAP[rawServiceId] || rawServiceId;

    const response = await axios.get(

        "https://sandbox.vtpass.com/api/service-variations",

        {

            params: { serviceID },

            headers: {

                "api-key": process.env.VTPASS_API_KEY,

                "public-key": process.env.VTPASS_PUBLIC_KEY

            }

        }

    );

    return {

        success: true,

        data: response.data

    };

};

module.exports = {

    vtpassPayment,

    getServiceVariations

};