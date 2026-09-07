const express = require("express");

const router = express.Router();

const auth = require("../middleware/authMiddleware");

const {
    getSettings,
    checkMaintenance,
    checkService
} = require("../middleware/settingsMiddleware");

const {
    getDataPlans,
    buyData
} = require("../controllers/dataController");

const requireTransactionPin = require("../middleware/requireTransactionPin");

router.get(
    "/plans/:network",
    auth,
    getSettings,
    checkMaintenance,
    checkService("data"),
    getDataPlans
);

router.post(
    "/buy",
    auth,
    getSettings,
    checkMaintenance,
    checkService("data"),
    requireTransactionPin,
    buyData
);

module.exports = router;