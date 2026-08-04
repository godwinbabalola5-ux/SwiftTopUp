const express = require("express");

const router = express.Router();

const verifyToken = require("../middleware/authMiddleware");

const verifyAdmin = require("../middleware/adminMiddleware");

const {

    getSettings,
    updateSettings

} = require("../controllers/settingsController");

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