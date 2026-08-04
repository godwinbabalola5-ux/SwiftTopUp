const db = require("../config/db");
const logActivity = require("../utils/logActivity");
// ===============================
// Dashboard Statistics
// ===============================
const getDashboard = (req, res) => {

    db.query(
        `
        SELECT
            (SELECT COUNT(*) FROM users) AS totalUsers,
            (SELECT COUNT(*) FROM users WHERE DATE(created_at)=CURDATE()) AS newUsersToday,
            (SELECT IFNULL(SUM(wallet),0) FROM users) AS totalWallet,
            (SELECT COUNT(*) FROM transactions) AS totalTransactions,
            (SELECT IFNULL(SUM(amount),0)
                FROM transactions
                WHERE type='fund') AS totalFunding,
            (SELECT IFNULL(SUM(amount),0)
                FROM transactions
                WHERE DATE(created_at)=CURDATE()) AS todayRevenue,
            (SELECT IFNULL(SUM(amount),0)
                FROM transactions
                WHERE MONTH(created_at)=MONTH(CURDATE())
                AND YEAR(created_at)=YEAR(CURDATE())
            ) AS monthlyRevenue
        `,
        (err, result) => {

            if (err) {
                return res.status(500).json({
                    success: false,
                    message: err.message
                });
            }

            res.json({
                success: true,
                dashboard: result[0]
            });

        }
    );

};

// ===============================
// Get All Users
// ===============================
const getUsers = (req, res) => {

    db.query(
        `
        SELECT
            id,
            fullname,
            email,
            phone,
            wallet,
            role,
            status,
            created_at
        FROM users
        ORDER BY created_at DESC
        `,
        (err, result) => {

            if (err) {
                return res.status(500).json({
                    success: false,
                    message: err.message
                });
            }

            res.json({
                success: true,
                users: result
            });

        }
    );

};

// ===============================
// Suspend / Activate User
// ===============================
const updateUserStatus = (req, res) => {

    const { id } = req.params;
    const { status } = req.body;

    db.query(
        "UPDATE users SET status=? WHERE id=?",
        [status, id],
        (err) => {

            if (err) {
                return res.status(500).json({
                    success: false,
                    message: err.message
                });
            }

            // Log Activity
            logActivity(
                req.user.id,
                `User ${status}`,
                `User ID: ${id}`
            );

            res.json({
                success: true,
                message: `User ${status} successfully.`
            });

        }
    );

};

// ===============================
// Delete User
// ===============================
const deleteUser = (req, res) => {

    const { id } = req.params;

    db.query(
        "DELETE FROM users WHERE id=?",
        [id],
        (err) => {

            if (err) {
                return res.status(500).json({
                    success: false,
                    message: err.message
                });
            }

            // Log Activity
            logActivity(
                req.user.id,
                "User deleted",
                `User ID: ${id}`
            );

            res.json({
                success: true,
                message: "User deleted successfully."
            });

        }
    );

};

// ===============================
// Analytics
// ===============================
const getAnalytics = (req, res) => {

    db.query(
        `
        SELECT
            DATE(created_at) AS day,
            SUM(CASE WHEN type='fund' THEN amount ELSE 0 END) AS funding,
            SUM(CASE WHEN type='airtime' THEN amount ELSE 0 END) AS airtime,
            SUM(CASE WHEN type='data' THEN amount ELSE 0 END) AS data,
            SUM(CASE WHEN type='electricity' THEN amount ELSE 0 END) AS electricity,
            SUM(CASE WHEN type='cable' THEN amount ELSE 0 END) AS cable
        FROM transactions
        WHERE created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)
        GROUP BY DATE(created_at)
        ORDER BY DATE(created_at)
        `,
        (err, result) => {

            if (err) {
                return res.status(500).json({
                    success: false,
                    message: err.message
                });
            }

            res.json({
                success: true,
                analytics: result
            });

        }
    );

};

// ===============================
// Get All Transactions
// ===============================
const getTransactions = (req, res) => {

    db.query(
        `
        SELECT
            id,
            type,
            amount,
            status,
            reference,
            provider,
            customer,
            response,
            created_at
        FROM transactions
        ORDER BY created_at DESC
        `,
        (err, result) => {

            if (err) {
                return res.status(500).json({
                    success: false,
                    message: err.message
                });
            }

            res.json({
                success: true,
                transactions: result
            });

        }
    );

};

// ===============================
// Get Single Transaction
// ===============================
const getTransaction = (req, res) => {

    const { id } = req.params;

    db.query(
        `
        SELECT *
        FROM transactions
        WHERE id = ?
        `,
        [id],
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
                    message: "Transaction not found."
                });
            }

            res.json({
                success: true,
                transaction: result[0]
            });

        }
    );

};
const getTopServices = (req, res) => {

    db.query(
        `
        SELECT
            type,
            COUNT(*) AS totalTransactions,
            SUM(amount) AS totalRevenue
        FROM transactions
        GROUP BY type
        ORDER BY totalRevenue DESC
        `,
        (err, result) => {

            if (err) {

                return res.status(500).json({
                    success: false,
                    message: err.message
                });

            }

            res.json({
                success: true,
                services: result
            });

        }
    );

};
const getActivityLogs = (req, res) => {

    db.query(
        `
        SELECT
            activity_logs.*,
            users.fullname
        FROM activity_logs
        JOIN users
            ON activity_logs.admin_id = users.id
        ORDER BY activity_logs.created_at DESC
        LIMIT 10
        `,
        (err, result) => {

            if (err) {

                return res.status(500).json({
                    success: false,
                    message: err.message
                });

            }

            res.json({
                success: true,
                logs: result
            });

        }
    );

};

// ===============================
// Export Controllers
// ===============================
module.exports = {
    getDashboard,
    getUsers,
    updateUserStatus,
    deleteUser,
    getAnalytics,
    getTransactions,
    getTransaction,
    getTopServices,
    getActivityLogs
};