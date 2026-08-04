const { query } = require("../config/db");

const deductWallet = (userId, amount, callback) => {

    query(
        "SELECT wallet FROM users WHERE id = ?",
        [userId],
        (err, results) => {

            if (err) return callback(err);

            if (results.length === 0) {
                return callback(new Error("User not found."));
            }

            const wallet = parseFloat(results[0].wallet);

            if (wallet < amount) {
                return callback(new Error("Insufficient wallet balance."));
            }

            query(
                "UPDATE users SET wallet = wallet - ? WHERE id = ?",
                [amount, userId],
                (err) => {

                    if (err) return callback(err);

                    callback(null);

                }
            );

        }
    );

};

const creditWallet = (userId, amount, callback) => {

    query(
        "UPDATE users SET wallet = wallet + ? WHERE id = ?",
        [amount, userId],
        (err) => {

            if (err) return callback(err);

            callback(null);

        }
    );

};

const getWalletBalance = (userId, callback) => {

    query(
        "SELECT wallet FROM users WHERE id = ?",
        [userId],
        (err, results) => {

            if (err) return callback(err);

            if (results.length === 0) {
                return callback(new Error("User not found."));
            }

            callback(null, results[0].wallet);

        }
    );

};

module.exports = {

    deductWallet,

    creditWallet,

    getWalletBalance

};