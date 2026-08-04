const express = require("express");

const router = express.Router();

const verifyToken = require("../middleware/authMiddleware");

const {
    fundWallet,
    getWalletBalance,
    getTransactions
} = require("../controllers/walletController");
router.post("/fund", verifyToken, fundWallet);

router.get("/balance", verifyToken, getWalletBalance);

router.get("/transactions", verifyToken, getTransactions);

module.exports = router;