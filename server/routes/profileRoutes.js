const express = require("express");

const router = express.Router();

const auth = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");
const {

    getProfile,
    updateProfile,
    uploadProfilePicture,
    changePassword


} = require("../controllers/profileController");

router.get("/", auth, getProfile);

router.put("/", auth, updateProfile);
router.put("/change-password", auth, changePassword);
router.post(
    "/upload",
    auth,
    upload.single("profile"),
    uploadProfilePicture
);
module.exports = router;