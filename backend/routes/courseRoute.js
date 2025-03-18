const express = require("express");
const {
    addCourse,
    getAllCourses,
    getCourseById,
    updateCourse,
    deleteCourse,
    lecturesvideo,
    isEncrolled,
    getAllMyCourses
} = require("../controllers/courseController");
const authenticateAdmin = require("../middleware/adminMiddleware");
const upload = require("../middleware/upload");
const checkEnrollment = require("../middleware/coureMiddleware");
const authenticateUser = require("../middleware/authMiddleware");
// const { isErrored } = require("nodemailer/lib/xoauth2");
// const { authenticateToken, isAdmin } = require("../middleware/isAdminMiddleware");

const router = express.Router();

router.post("/add-course", authenticateAdmin, upload.single("courseImage"), addCourse);        // Create a course
router.get("/my", authenticateAdmin, getAllMyCourses);
router.get("/", getAllCourses);        // Get all courses
router.get("/:id", getCourseById);     // Get a single course by ID
router.put("/:id", authenticateAdmin, upload.single("courseImage"), updateCourse);      // Update a course
router.delete("/:id", authenticateAdmin, deleteCourse);   // Delete a course
router.get("/:courseId/lecturesdetails", authenticateUser, checkEnrollment, lecturesvideo);
router.get("/is-enrolled/:courseId", authenticateUser, isEncrolled);
router.get("/:courseId/lectures", authenticateAdmin, lecturesvideo);


module.exports = router;
