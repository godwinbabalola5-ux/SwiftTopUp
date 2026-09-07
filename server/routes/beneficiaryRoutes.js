const express = require("express");
const router = express.Router();

const verifyToken = require("../middleware/authMiddleware");

const {
    getBeneficiaries,
    addBeneficiary,
    deleteBeneficiary
} = require("../controllers/beneficiaryController");

router.get("/", verifyToken, getBeneficiaries);
router.post("/", verifyToken, addBeneficiary);
router.delete("/:id", verifyToken, deleteBeneficiary);

module.exports = router;
