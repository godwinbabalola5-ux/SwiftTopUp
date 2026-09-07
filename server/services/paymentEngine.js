const { DEVELOPMENT_MODE } = require("../config/appConfig");

const { mockPayment } = require("./mockService");

const { vtpassPayment, getServiceVariations } = require("./vtpassService");

const paymentEngine = async (type, payload) => {

    if (DEVELOPMENT_MODE) {

        return await mockPayment(type, payload);

    }

    // "dataPlans" and "cablePlans" are requests to FETCH the list of
    // plans/bouquets for a network or provider — a completely different
    // VTpass endpoint (GET /api/service-variations) from the one used
    // to actually buy something (POST /api/pay). These used to fall
    // through to vtpassPayment(payload) below, which sent them to the
    // wrong endpoint and came back empty.
    if (type === "dataPlans") {
        return await getServiceVariations(payload.network);
    }

    if (type === "cablePlans") {
        return await getServiceVariations(payload.provider);
    }

    return await vtpassPayment(payload);

};

module.exports = paymentEngine;