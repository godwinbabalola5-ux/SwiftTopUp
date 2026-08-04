const verifyToken = require("../middleware/authMiddleware");
const express = require("express");

console.log("✅ userRoutes.js has been loaded");

const router = express.Router();

const {
    registerUser,
    loginUser
} = require("../controllers/userController");

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/profile", verifyToken, (req, res) => {

    res.json({
        success: true,
        message: "Welcome to your profile!",
        user: req.user
    });
router.get("/test", (req, res) => {
    res.json({
        success: true,
        message: "User route works!"
    });
});
});
module.exports = router;