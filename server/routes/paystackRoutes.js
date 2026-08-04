const express = require("express");

const router = express.Router();

const auth = require("../middleware/authMiddleware");

const {
    initializePayment,
    verifyPayment
} = require("../controllers/paystackController");

router.post("/initialize", auth, initializePayment);

router.get("/verify/:reference", auth, verifyPayment);

module.exports = router;