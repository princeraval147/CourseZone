const express = require("express");
// Make sure the path is correct relative to the current file
const { createCourse, getAllCourses, getSingleCourse, getAdminCourses, updateCourse } = require("../controllers/courseController.js");
const authenticateUser = require("../middleware/authMiddleware.js");
const authenticateAdmin = require("../middleware/adminMiddleware.js"); 

const router = express.Router();

router.post("/create", authenticateUser, authenticateAdmin, createCourse);
router.get("/getallcourse", getAllCourses);
router.get("/getsinglecourse/:id", getSingleCourse);
router.get("/getAdminCourse",authenticateUser,authenticateAdmin, getAdminCourses);
router.put("/update/:id",authenticateAdmin, updateCourse);
  

module.exports = router;
