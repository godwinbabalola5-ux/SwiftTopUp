const db = require("../config/db");

const createTransaction = (
    userId,
    type,
    amount,
    reference,
    status = "pending",
    callback
) => {

    db.query(
        `INSERT INTO transactions
        (user_id,type,amount,status,reference)
        VALUES (?,?,?,?,?)`,
        [
            userId,
            type,
            amount,
            status,
            reference
        ],
        callback
    );

};

const updateStatus = (
    reference,
    status,
    callback
) => {

    db.query(
        `UPDATE transactions
        SET status = ?
        WHERE reference = ?`,
        [
            status,
            reference
        ],
        callback
    );

};

module.exports = {
    createTransaction,
    updateStatus
};