const express = require("express");

const router = express.Router();

const auth = require("../middleware/authMiddleware");

const {

    getTransactions,
    getTransactionById

} = require("../controllers/transactionController");

router.get(

    "/",

    auth,

    getTransactions

);

router.get(

    "/:id",

    auth,

    getTransactionById

);

module.exports = router;