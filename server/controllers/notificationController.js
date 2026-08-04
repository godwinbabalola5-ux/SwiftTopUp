const { query } = require("../config/db");

// GET ALL NOTIFICATIONS
const getNotifications = (req, res) => {

    const userId = req.user.id;

    query(
        `SELECT *
         FROM notifications
         WHERE user_id=?
         ORDER BY created_at DESC`,
        [userId],
        (err, result) => {

            if (err) {
                return res.status(500).json({
                    success: false,
                    message: err.message
                });
            }

            res.json({
                success: true,
                notifications: result
            });

        }
    );

};

// MARK AS READ
const markAsRead = (req, res) => {

    const userId = req.user.id;
    const notificationId = req.params.id;

    query(
        "UPDATE notifications SET is_read=1 WHERE id=? AND user_id=?",
        [notificationId, userId],
        (err) => {

            if (err) {
                return res.status(500).json({
                    success:false,
                    message:err.message
                });
            }

            res.json({
                success:true,
                message:"Notification marked as read."
            });

        }
    );

};

module.exports = {
    getNotifications,
    markAsRead
};