const express = require("express");
const router = express.Router();

const {
    getBusinessWallet
} = require("../controllers/businessWalletController");

const verifyToken = require("../middleware/authMiddleware");
const verifyAdmin = require("../middleware/adminMiddleware");

router.get(
    "/",
    verifyToken,
    verifyAdmin,
    getBusinessWallet
);

module.exports = router;