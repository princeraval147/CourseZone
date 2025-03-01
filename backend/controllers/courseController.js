const Course = require("../models/Course.js");
const Lecture = require("../models/Lecture.js");

// Create Course
exports.createCourse = async (req, res) => {
  try {
    const { title, feature, price, oldPrice, language, certificate, totalContent, thumbnail, description, category } = req.body;

    // Validate required fields
    if (!title || !feature || !price || !oldPrice || !language || !certificate || !totalContent || !thumbnail || !description || !category) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newCourse = new Course({
      title,
      feature,
      price,
      oldPrice,
      language,
      certificate,
      totalContent,
      thumbnail,
      description,
      category,
      creator: req.user._id, 
    });

    await newCourse.save();
    res.status(201).json({ message: "Course created successfully", course: newCourse });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get All Courses
exports.getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find().populate("creator", "name email").populate("lectures"); // Fetch courses with creator details
    res.status(200).json(courses);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.getSingleCourse = async (req, res) => {

  try {
    const course = await Course.findById(req.params.id).populate("creator", "username email").populate("lectures");
    if (!course) {
      console.log("Course not found in database!");
      return res.status(404).json({ message: "Course not found" });
    }
    res.json(course);
  } catch (error) {
    console.log("Error fetching course:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

exports.getAdminCourses = async (req, res) => {
  try {
    const adminId = req.user; 
    
    const courses = await Course.find({ creator: adminId });

    if (!courses.length) {
      return res.status(404).json({ message: "No courses found for this admin." });
    }

    res.json(courses);
  } catch (error) {
    console.error("Error fetching admin courses:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.updateCourse = async (req, res) => {
  const { id } = req.params;
  const updatedData = req.body;

  try {
    // Find and update the course
    const updatedCourse = await Course.findByIdAndUpdate(id, updatedData, { new: true });

    if (!updatedCourse) {
      return res.status(404).json({ message: "Course not found!" });
    }

    res.status(200).json({ message: "Course updated successfully!", updatedCourse });
  } catch (error) {
    console.error("Error updating course:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
