const express = require("express");

const router = express.Router();

const auth = require("../middleware/authMiddleware");

const {
    getSettings,
    checkMaintenance,
    checkService
} = require("../middleware/settingsMiddleware");

const {
    buyAirtime
} = require("../controllers/airtimeController");

const requireTransactionPin = require("../middleware/requireTransactionPin");

router.post(
    "/buy",
    auth,
    getSettings,
    checkMaintenance,
    checkService("airtime"),
    requireTransactionPin,
    buyAirtime
);

module.exports = router;