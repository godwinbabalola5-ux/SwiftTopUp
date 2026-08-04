const express = require("express");

const router = express.Router();

const verifyToken = require("../middleware/authMiddleware");

const {
    buyAirtime
} = require("../controllers/vtpassController");

router.post("/airtime", verifyToken, buyAirtime);

module.exports = router;