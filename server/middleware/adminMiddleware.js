const db = require("../config/db");

const admin = (req, res, next) => {

    const userId = req.user.id;

    db.query(
        "SELECT role FROM users WHERE id = ?",
        [userId],
        (err, result) => {

            if (err) {
                return res.status(500).json({
                    success: false,
                    message: err.message
                });
            }

            if (result.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: "User not found."
                });
            }

            if (result[0].role !== "admin") {
                return res.status(403).json({
                    success: false,
                    message: "Access denied. Admin only."
                });
            }

            next();

        }
    );

};

module.exports = admin;