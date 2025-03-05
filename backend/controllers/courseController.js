const Course = require("../models/Course.js");
const Lecture = require("../models/Lecture.js");
const path = require("path");
const fs = require("fs");

const addCourse = async (req, res) => {
  try {
    const { title, description, price, oldPrice, duration, courseSections, courseBenefits, language } = req.body;

    // Parse courseSections if sent as a JSON string
    const parsedSections = JSON.parse(courseSections);

    // Get uploaded image path
    const courseImage = req.file ? req.file.filename : null;

    // Create new course instance
    const newCourse = new Course({
      title,
      description,
      price,
      oldPrice,
      duration,
      courseSections: parsedSections,
      courseImage,
      courseBenefits,
      language,
      instructor: req.user._id,
    });

    // Save to database
    await newCourse.save();

    res.status(201).json({ message: "Course added successfully", course: newCourse });
  } catch (error) {
    console.error("Error adding course:", error);
    res.status(500).json({ message: "Internal Server Error", error });
  }
};


const getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find().populate("instructor", "username email");
    res.status(200).json({ success: true, courses });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
};

const getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id).populate("instructor", "username email");
    if (!course) {
      return res.status(404).json({ success: false, message: "Course not found" });
    }
    res.status(200).json({ success: true, course });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
};

const updateCourse = async (req, res) => {
  try {
    const courseId = req.params.id;
    const { title, description, price, oldPrice, duration, language, courseBenefits, courseSections } = req.body;

    // Find the course by ID
    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    // Handle image upload (if new image is provided)
    let updatedCourseImage = course.courseImage; // Keep old image by default
    if (req.file) {
      // If new image is uploaded, delete the old image from the public/images/course-thumbnail folder
      if (course.courseImage) {
        const oldImagePath = path.join(__dirname, '..', 'public', 'images', 'course-thumbnail', course.courseImage);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath); // Delete the old image
        }
      }
      updatedCourseImage = req.file.filename; // Set the new image filename
    }

    // Update the course with new data
    course.title = title || course.title;
    course.description = description || course.description;
    course.price = price || course.price;
    course.oldPrice = oldPrice || course.oldPrice;
    course.duration = duration || course.duration;
    course.language = language || course.language;
    course.courseBenefits = courseBenefits || course.courseBenefits;
    course.courseImage = updatedCourseImage; // Set updated image
    course.courseSections = JSON.parse(courseSections) || course.courseSections;

    await course.save(); // Save the updated course

    res.status(200).json({
      success: true,
      message: 'Course updated successfully',
      course: course,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Failed to update course' });
  }
};

const deleteCourse = async (req, res) => {
  try {
    // Find the course by ID
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ success: false, message: "Course not found" });
    }

    // Delete the image file (if stored locally)
    if (course.image) {
      const imagePath = path.join("public/image/course-thumbnail", course.image);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    // Delete the course from the database
    await Course.findByIdAndDelete(req.params.id);

    res.status(200).json({ success: true, message: "Course and image deleted successfully" });
  } catch (error) {
    console.error("Error deleting course:", error);
    res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
};



module.exports = { addCourse, getAllCourses, getCourseById, updateCourse, deleteCourse, updateCourse };
