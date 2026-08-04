const express = require("express");

const router = express.Router();

const auth = require("../middleware/authMiddleware");
const admin = require("../middleware/adminMiddleware");

const {
    getWalletUsers,
    updateWallet,
    getWalletHistory
} = require("../controllers/adminWalletController");

// ===============================
// Wallet Users
// ===============================
router.get(
    "/users",
    auth,
    admin,
    getWalletUsers
);

// ===============================
// Credit / Debit Wallet
// ===============================
router.put(
    "/:id",
    auth,
    admin,
    updateWallet
);

// ===============================
// Wallet Adjustment History
// ===============================
router.get(
    "/history",
    auth,
    admin,
    getWalletHistory
);

module.exports = router;