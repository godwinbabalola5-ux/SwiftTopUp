const express = require("express");

const router = express.Router();

const auth = require("../middleware/authMiddleware");
const admin = require("../middleware/adminMiddleware");

const {
    getRefundRequests,
    approveRefund
} = require("../controllers/adminRefundController");

// Get all pending refunds
router.get(
    "/",
    auth,
    admin,
    getRefundRequests
);

// Approve refund
router.put(
    "/:id/approve",
    auth,
    admin,
    approveRefund
);

module.exports = router;