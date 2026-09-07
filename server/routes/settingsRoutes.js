const express = require("express");

const router = express.Router();

const verifyToken = require("../middleware/authMiddleware");

const verifyAdmin = require("../middleware/adminMiddleware");

const {

    getSettings,
    getPublicSettings,
    updateSettings

} = require("../controllers/settingsController");

// Public — no auth. Only exposes company name + support contact info,
// nothing sensitive (see getPublicSettings in the controller).
router.get(
    "/public",
    getPublicSettings
);

router.get(

    "/",

    verifyToken,
    verifyAdmin,

    getSettings

);

router.put(

    "/",

    verifyToken,
    verifyAdmin,

    updateSettings

);

module.exports = router;