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
    myCourses,
    savecourse,
    getSavedCourses,
    instructorrequest,
    toggleSavedCourse,
    checkCourse,
    getallinstrucors,
    pramoteadmin,
    demotestudent
} = require("../controllers/authController");
const authenticateUser = require("../middleware/authMiddleware");
const upload = require("../utils/multer");
const { authenticateToken, isAdmin } = require("../middleware/isAdminMiddleware");

const router = express.Router();

router.post("/register", register);
router.post("/verify-otp", verifyOTP);
router.post("/login", login);
router.post("/logout", logout);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.get("/profile", authenticateUser, getProfile);
router.get("/authenticate", authenticateUser, authenticate);
// router.put("/update-profile", authenticateUser, updateProfile); 
router.put("/update-profile", authenticateUser, upload.single("profilePhoto"), updateProfile);
router.get("/me", authenticateUser, userrole);
router.get("/isLoggedIn", authenticateUser, isLoggedIn);
router.get("/my-courses", authenticateUser, myCourses);
router.post("/toggle-save", authenticateUser, toggleSavedCourse);
router.get("/saved-courses", authenticateUser, getSavedCourses);
router.post("/instructor/request", authenticateUser, instructorrequest);
router.post("/checkCourse", checkCourse);
router.get("/instructors", authenticateToken, isAdmin, getallinstrucors);
router.put("/instructors/:id/promote", authenticateToken, isAdmin, pramoteadmin)
router.put("/instructors/:id/demote", authenticateToken, isAdmin, demotestudent)

module.exports = router;