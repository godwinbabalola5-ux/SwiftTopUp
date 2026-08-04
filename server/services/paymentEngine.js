const { DEVELOPMENT_MODE } = require("../config/appConfig");

const { mockPayment } = require("./mockService");

const { vtpassPayment } = require("./vtpassService");

const paymentEngine = async (type, payload) => {

    if (DEVELOPMENT_MODE) {

        return await mockPayment(type, payload);

    }

    return await vtpassPayment(payload);

};

module.exports = paymentEngine;