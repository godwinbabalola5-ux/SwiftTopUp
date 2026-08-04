const express = require("express");

const router = express.Router();

const auth = require("../middleware/authMiddleware");

const {
    getSettings,
    checkMaintenance,
    checkService
} = require("../middleware/settingsMiddleware");

const {
    getDiscos,
    buyElectricity
} = require("../controllers/electricityController");

router.get(
    "/providers",
    auth,
    getSettings,
    checkMaintenance,
    checkService("electricity"),
    getDiscos
);

router.post(
    "/buy",
    auth,
    getSettings,
    checkMaintenance,
    checkService("electricity"),
    buyElectricity
);

module.exports = router;