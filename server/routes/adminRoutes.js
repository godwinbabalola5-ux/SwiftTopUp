const express = require("express");

const router = express.Router();

const auth = require("../middleware/authMiddleware");
const admin = require("../middleware/adminMiddleware");

const {
    getDashboard,
    getUsers,
    updateUserStatus,
    deleteUser,
    getAnalytics,
    getTransactions,
    getTransaction,
    getTopServices,
    getActivityLogs
} = require("../controllers/adminController");

// Dashboard
router.get("/dashboard", auth, admin, getDashboard);

// Users
router.get("/users", auth, admin, getUsers);

router.put(
    "/users/:id/status",
    auth,
    admin,
    updateUserStatus
);

router.delete(
    "/users/:id",
    auth,
    admin,
    deleteUser
);

// Analytics
router.get(
    "/analytics",
    auth,
    admin,
    getAnalytics
);

// All Transactions
router.get(
    "/transactions",
    auth,
    admin,
    getTransactions
);

// Single Transaction
router.get(
    "/transactions/:id",
    auth,
    admin,
    getTransaction
);
router.get(
    "/top-services",
    auth,
    admin,
    getTopServices
);
router.get(
    "/activity-logs",
    auth,
    admin,
    getActivityLogs
);

module.exports = router;