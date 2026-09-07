const express = require("express");

const router = express.Router();

const {
    requestWithdrawal,
    getWithdrawals,
    approveWithdrawal,
    rejectWithdrawal
} = require("../controllers/businessWithdrawalController");

const authMiddleware = require("../middleware/authMiddleware");

// ==========================================
// REQUEST BUSINESS WITHDRAWAL
// ==========================================

router.post(
    "/",
    authMiddleware,
    requestWithdrawal
);

// ==========================================
// GET ALL WITHDRAWALS
// ==========================================

router.get(
    "/",
    authMiddleware,
    getWithdrawals
);

// ==========================================
// APPROVE WITHDRAWAL
// ==========================================

router.post(
    "/:id/approve",
    authMiddleware,
    approveWithdrawal
);

// ==========================================
// REJECT WITHDRAWAL
// ==========================================

router.post(
    "/:id/reject",
    authMiddleware,
    rejectWithdrawal
);

module.exports = router;