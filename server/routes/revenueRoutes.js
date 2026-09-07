const express = require("express");

const router = express.Router();

const {
    getRevenueSummary,
    getRevenueByService,
    getRecentRevenue
} = require("../controllers/revenueController");

const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");


router.get(
    "/summary",
    authMiddleware,
    adminMiddleware,
    getRevenueSummary
);


router.get(
    "/services",
    authMiddleware,
    adminMiddleware,
    getRevenueByService
);


router.get(
    "/recent",
    authMiddleware,
    adminMiddleware,
    getRecentRevenue
);


module.exports = router;