const express = require("express");

const router = express.Router();

const auth = require("../middleware/authMiddleware");

const {

    getRecentTransactions

} = require("../controllers/recentTransactionController");

router.get("/", auth, getRecentTransactions);

module.exports = router;