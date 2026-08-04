const express = require("express");

const router = express.Router();

const auth = require("../middleware/authMiddleware");

const {

    getAnalytics

} = require("../controllers/analyticsController");

router.get("/",auth,getAnalytics);

module.exports=router;