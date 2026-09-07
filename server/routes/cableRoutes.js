const express = require("express");

const router = express.Router();

const auth = require("../middleware/authMiddleware");

const {
    getSettings,
    checkMaintenance,
    checkService
} = require("../middleware/settingsMiddleware");

const {
    getProviders,
    getPlans,
    buyCable
} = require("../controllers/cableController");

const requireTransactionPin = require("../middleware/requireTransactionPin");

router.get(
    "/providers",
    auth,
    getSettings,
    checkMaintenance,
    checkService("cable"),
    getProviders
);

router.get(
    "/plans/:provider",
    auth,
    getSettings,
    checkMaintenance,
    checkService("cable"),
    getPlans
);

router.post(
    "/buy",
    auth,
    getSettings,
    checkMaintenance,
    checkService("cable"),
    requireTransactionPin,
    buyCable
);

module.exports = router;