const { query } = require("../config/db");
const createNotification = require("../utils/createNotification");
const bcrypt = require("bcrypt");

// ===============================
// GET PROFILE
// ===============================
const getProfile = (req, res) => {

    const userId = req.user.id;

    query(
        `SELECT
            id,
            fullname,
            email,
            phone,
            wallet,
            role,
            profile_picture,
            created_at,
            last_login
        FROM users
        WHERE id = ?`,
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
                profile: result[0]
            });

        }
    );

};

// ===============================
// UPDATE PROFILE
// ===============================
const updateProfile = (req, res) => {

    const userId = req.user.id;

    const { fullname, phone } = req.body;

    query(
        "SELECT id FROM users WHERE phone = ? AND id != ?",
        [phone, userId],
        (err, result) => {

            if (err) {
                return res.status(500).json({
                    success: false,
                    message: err.message
                });
            }

            if (result.length > 0) {
                return res.status(400).json({
                    success: false,
                    message: "Phone number already exists."
                });
            }

            query(
                "UPDATE users SET fullname=?, phone=? WHERE id=?",
                [fullname, phone, userId],
                (err) => {

                    if (err) {
                        return res.status(500).json({
                            success: false,
                            message: err.message
                        });
                    }

                    createNotification(
                        userId,
                        "Profile Updated",
                        "Your profile information was updated successfully."
                    );

                    res.json({
                        success: true,
                        message: "Profile updated successfully."
                    });

                }
            );

        }
    );

};

// ===============================
// UPLOAD PROFILE PICTURE
// ===============================
const uploadProfilePicture = (req, res) => {

    const userId = req.user.id;

    if (!req.file) {

        return res.status(400).json({
            success: false,
            message: "No image uploaded."
        });

    }

    const imagePath = `/uploads/profiles/${req.file.filename}`;

    query(
        "UPDATE users SET profile_picture=? WHERE id=?",
        [imagePath, userId],
        (err) => {

            if (err) {
                return res.status(500).json({
                    success: false,
                    message: err.message
                });
            }

            createNotification(
                userId,
                "Profile Picture Updated",
                "Your profile picture was updated successfully."
            );

            res.json({
                success: true,
                message: "Profile picture uploaded successfully.",
                image: imagePath
            });

        }
    );

};

// ===============================
// CHANGE PASSWORD
// ===============================
const changePassword = (req, res) => {

    const userId = req.user.id;

    const { currentPassword, newPassword } = req.body;

    query(
        "SELECT password FROM users WHERE id=?",
        [userId],
        async (err, result) => {

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

            const valid = await bcrypt.compare(
                currentPassword,
                result[0].password
            );

            if (!valid) {
                return res.status(400).json({
                    success: false,
                    message: "Current password is incorrect."
                });
            }

            const hashedPassword = await bcrypt.hash(newPassword, 10);

            query(
                "UPDATE users SET password=? WHERE id=?",
                [hashedPassword, userId],
                (err) => {

                    if (err) {
                        return res.status(500).json({
                            success: false,
                            message: err.message
                        });
                    }

                    createNotification(
                        userId,
                        "Password Changed",
                        "Your account password was changed successfully."
                    );

                    res.json({
                        success: true,
                        message: "Password changed successfully."
                    });

                }
            );

        }
    );

};

module.exports = {
    getProfile,
    updateProfile,
    uploadProfilePicture,
    changePassword
};