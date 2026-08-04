const express = require("express");
const router = express.Router();

const auth = require("../middleware/authMiddleware");

const {
    getCashbackHistory,
    withdrawCashback
} = require("../controllers/cashbackController");


// =======================================
// CASHBACK HISTORY
// =======================================

router.get(
    "/history",
    auth,
    getCashbackHistory
);


// =======================================
// WITHDRAW CASHBACK
// =======================================

router.post(
    "/withdraw",
    auth,
    withdrawCashback
);


module.exports = router;