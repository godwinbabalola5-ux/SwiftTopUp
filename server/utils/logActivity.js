const db = require("../config/db");

const logActivity = (adminId, action, target = "", amount = 0) => {

    db.query(
        `
        INSERT INTO activity_logs
        (admin_id, action, target, amount)
        VALUES (?, ?, ?, ?)
        `,
        [
            adminId,
            action,
            target,
            amount
        ]
    );

};

module.exports = logActivity;