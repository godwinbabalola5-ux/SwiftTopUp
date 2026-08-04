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

router.post(
    "/buy",
    auth,
    getSettings,
    checkMaintenance,
    checkService("airtime"),
    buyAirtime
);

module.exports = router;