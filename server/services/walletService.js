const { query, execute } = require("../config/db");

// ==========================================
// ATOMIC WALLET DEDUCTION
// ==========================================
// Old approach (SELECT balance, check in JS, THEN update) has a race
// condition: two requests can both read the same balance before either
// UPDATE lands, both pass the "enough funds" check, and both deduct —
// pushing the wallet negative. This does the check AND the deduction
// in one atomic SQL statement, so MySQL itself guarantees only one of
// two simultaneous requests can succeed if there's only enough for one.
//
// Returns true on success. Throws an Error("Insufficient wallet balance.")
// if the user doesn't have enough at the moment the query actually runs
// (not at the moment we last checked in JS).
const deductWalletAtomic = async (userId, amount) => {

    const [result] = await execute(
        "UPDATE users SET wallet = wallet - ? WHERE id = ? AND wallet >= ?",
        [amount, userId, amount]
    );

    if (result.affectedRows === 0) {
        throw new Error("Insufficient wallet balance.");
    }

    return true;

};

// ==========================================
// ATOMIC WALLET CREDIT (promise-based)
// ==========================================
// A plain "wallet = wallet + ?" is already atomic as a single UPDATE
// statement, so no special locking is needed here — this just gives
// controllers using async/await a promise-based version to match
// deductWalletAtomic, mainly for refunding a failed purchase.
const creditWalletAtomic = async (userId, amount) => {

    await execute(
        "UPDATE users SET wallet = wallet + ? WHERE id = ?",
        [amount, userId]
    );

    return true;

};

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

    getWalletBalance,

    deductWalletAtomic,

    creditWalletAtomic

};