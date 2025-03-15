const express = require("express");
const {
    register,
    verifyOTP,
    login,
    logout,
    forgotPassword,
    resetPassword,
    getProfile,
    updateProfile,
    authenticate,
    userrole,
    isLoggedIn,
    checkCourse,
    toggleSavedCourse,
    myCourses,
    getSavedCourses,
    instructorrequest
} = require("../controllers/authController");
const authenticateUser = require("../middleware/authMiddleware");
const upload = require("../utils/multer");

const router = express.Router();

router.post("/register", register);
router.post("/verify-otp", verifyOTP);
router.post("/login", login);
router.post("/logout", logout);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.post("/checkCourse", checkCourse);
router.get("/profile", authenticateUser, getProfile);
router.get("/authenticate", authenticateUser, authenticate);
router.put("/update-profile", authenticateUser, upload.single("profilePhoto"), updateProfile);
router.get("/me", authenticateUser, userrole);
router.get("/isLoggedIn", authenticateUser, isLoggedIn);
router.get("/my-courses", authenticateUser, myCourses);
router.post("/toggle-save", authenticateUser, toggleSavedCourse);
router.get("/saved-courses", authenticateUser, getSavedCourses);
router.post("/request", authenticateUser, instructorrequest);

module.exports = router;