const vtpass = require("./vtpassService");

const {
    deductWallet,
    creditWallet
} = require("./walletService");

const {
    createTransaction,
    updateStatus
} = require("./transactionService");

const generateReference = require("../utils/generateReference");

const purchase = async (userId, type, amount, payload) => {

    return new Promise((resolve, reject) => {

        deductWallet(userId, amount, async (err) => {

            if (err) {
                return reject(err);
            }

            const reference = generateReference(type);

            createTransaction(
                userId,
                type,
                amount,
                reference,
                "pending",
                async (err) => {

                    if (err) {

                        creditWallet(userId, amount, () => {});

                        return reject(err);
                    }

                    try {

                        payload.request_id = reference;

                        const response = await vtpass.post("/pay", payload);

                        const data = response.data;

                        const transactionStatus =
                            data.content?.transactions?.status;

                        if (
                            data.code === "000" &&
                            transactionStatus === "delivered"
                        ) {

                            updateStatus(reference, "success", () => {});

                            return resolve(data);
                        }

                        // Refund user

                        creditWallet(userId, amount, () => {});

                        updateStatus(reference, "failed", () => {});

                        return reject(data);

                    } catch (error) {

                        creditWallet(userId, amount, () => {});

                        updateStatus(reference, "failed", () => {});

                        return reject(
                            error.response?.data || error.message
                        );

                    }

                }

            );

        });

    });

};

module.exports = {
    purchase
};