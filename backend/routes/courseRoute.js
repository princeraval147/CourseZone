const express = require("express");
const { addCourse, getAllCourses, getCourseById, updateCourse, deleteCourse } = require("../controllers/courseController");
const authenticateAdmin = require("../middleware/adminMiddleware");
const upload = require("../middleware/upload");

const router = express.Router();

router.post("/add-course", authenticateAdmin, upload.single("courseImage"), addCourse);        // Create a course
router.get("/", getAllCourses);        // Get all courses
router.get("/:id", getCourseById);     // Get a single course by ID
router.put("/:id", authenticateAdmin, upload.single("courseImage"), updateCourse);      // Update a course
router.delete("/:id", authenticateAdmin, deleteCourse);   // Delete a course


module.exports = router;
