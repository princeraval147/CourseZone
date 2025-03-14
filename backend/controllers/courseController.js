const Course = require("../models/Course.js");
const Lecture = require("../models/Lecture.js");
const User = require("../models/User.js");
const path = require("path");
const fs = require("fs");

const addCourse = async (req, res) => {
  try {
    let { title, description, price, oldPrice, discount, duration, courseSections, courseBenefits, language } = req.body;

    const parsedSections = JSON.parse(courseSections);

    const benefitsArray = courseBenefits.split(",").map(benefit => benefit.trim());

    const courseImage = req.file ? req.file.filename : null;

    oldPrice = oldPrice || price; // Ensure oldPrice is available
    price = discount > 0 ? Math.round(oldPrice * (1 - discount / 100)) : oldPrice;

    const newCourse = new Course({
      title,
      description,
      price,
      oldPrice,
      discount,
      duration,
      courseSections: parsedSections,
      courseImage,
      courseBenefits: benefitsArray,
      language,
      instructor: req.user._id,
    });

    await newCourse.save();

    res.status(201).json({ message: "Course added successfully", course: newCourse });
  } catch (error) {
    console.error("Error adding course:", error);
    res.status(500).json({ message: "Internal Server Error", error });
  }
};

const getAllMyCourses = async (req, res) => {
  try {
    const courses = await Course.find({ instructor: req.user._id }).populate("instructor", "username email");
    res.status(200).json({ success: true, courses });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error", error: error.message });
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

    // Delete course image if exists
    if (course.courseImage) {
      const imagePath = path.join(__dirname, "../public/image/course-thumbnail", course.courseImage);  // Corrected image field name

      // Check if the file exists before trying to delete it
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);  // Delete the image file
        console.log(`Image deleted: ${imagePath}`);
      } else {
        console.log(`Image file not found: ${imagePath}`);
      }
    } else {
      console.log("No course image to delete.");
    }

    // Find all lectures associated with the course
    const lectures = await Lecture.find({ courseId: req.params.id });
    for (let lecture of lectures) {
      // Only try to delete video if it exists
      if (lecture.video) {
        const videoPath = path.join(__dirname, "../public/video/lectures", lecture.video);
        if (fs.existsSync(videoPath)) {
          fs.unlinkSync(videoPath);  // Delete the video file
          console.log(`Video deleted: ${videoPath}`);
        } else {
          console.log(`Video file not found: ${videoPath}`);
        }
      } else {
        console.log("No video file to delete for lecture:", lecture._id);
      }

      // Delete the lecture record from the database
      await Lecture.findByIdAndDelete(lecture._id);
    }

    // Delete the course record from the database
    await Course.findByIdAndDelete(req.params.id);

    res.status(200).json({ success: true, message: "Course and associated lectures deleted successfully" });
  } catch (error) {
    console.error("Error deleting course:", error);
    res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
};

const isEncrolled = async (req, res) => {
  try {
    const user = await User.findById(req.user);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    const isEnrolled = user.enrolledCourses.includes(req.params.courseId);
    res.json({ success: true, isEnrolled });
  } catch (error) {
    console.error("Error checking enrollment:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const lecturesvideo = async (req, res) => {
  try {
    const { courseId } = req.params;
    const course = await Course.findById(courseId).populate("lectures");
    res.json({ lectures: course.lectures });
  } catch (error) {
    res.status(500).json({ message: "Error fetching lectures" });
  }
}



module.exports = { addCourse, getAllCourses, getCourseById, updateCourse, deleteCourse, updateCourse, lecturesvideo, isEncrolled, getAllMyCourses };
