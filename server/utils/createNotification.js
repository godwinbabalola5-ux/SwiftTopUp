const { query } = require("../config/db");

const createNotification = (userId, title, message) => {

    query(

        `INSERT INTO notifications
        (user_id, title, message)
        VALUES (?, ?, ?)`,

        [userId, title, message],

        (err) => {

            if (err) {

                console.log("Notification Error:", err);

            }

        }

    );

};

module.exports = createNotification;