const express = require("express");
const { register, verifyOTP, login, logout ,forgotPassword,resetPassword,getProfile,updateProfile, authenticate,userrole} = require("../controllers/authController");
const authenticateUser = require("../middleware/authMiddleware");
const upload = require("../utils/multer");

const router = express.Router();

router.post("/register", register);
router.post("/verify-otp", verifyOTP);
router.post("/login", login);
router.post("/logout", logout);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.get("/profile", authenticateUser, getProfile);
router.get("/authenticate",authenticateUser, authenticate);
// router.put("/update-profile", authenticateUser, updateProfile); 
router.put("/update-profile", authenticateUser, upload.single("profilePhoto"), updateProfile);
router.get("/me", authenticateUser, userrole)

module.exports = router;