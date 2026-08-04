const express = require("express");

const router = express.Router();

const verifyToken = require("../middleware/authMiddleware");

const { verifyMeter } = require("../controllers/verifyController");

router.post("/meter", verifyToken, verifyMeter);

module.exports = router;