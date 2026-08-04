const express = require("express");

const router = express.Router();

const auth = require("../middleware/authMiddleware");

const {
    initializePayment,
    verifyPayment
} = require("../controllers/paymentController");

router.post(
    "/initialize",
    auth,
    initializePayment
);

router.get(
    "/verify",
    verifyPayment
);

module.exports = router;