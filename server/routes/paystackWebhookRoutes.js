const express = require("express");

const router = express.Router();

const {
    paystackWebhook
} = require("../controllers/paystackWebhookController");

router.post("/", paystackWebhook);

module.exports = router;