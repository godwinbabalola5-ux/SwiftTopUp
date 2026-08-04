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
    buyData
);

module.exports = router;