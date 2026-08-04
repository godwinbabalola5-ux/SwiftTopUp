const router=require("express").Router();

const auth=require("../middleware/authMiddleware");

const {

getReferral,

getReferralStats

}=require("../controllers/referralController");

router.get("/",auth,getReferral);

router.get("/stats",auth,getReferralStats);

module.exports=router;