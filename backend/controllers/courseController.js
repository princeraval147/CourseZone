const Course = require("../models/Course.js");
const Lecture = require("../models/Lecture.js");
const User = require("../models/User.js");
const path = require("path");
const fs = require("fs");
const { log } = require("console");
const cloudinary = require('cloudinary').v2;

//   try {
//     const { title, description, price, oldPrice, duration, courseSections, courseBenefits , language} = req.body;

//     // Parse courseSections if sent as a JSON string
//     const parsedSections = JSON.parse(courseSections);

//     // Get uploaded image path
//     const courseImage = req.file ? req.file.filename : null;

//     const newCourse = new Course({
//       title,
//       description,
//       price,
//       oldPrice,
//       duration,
//       courseSections: parsedSections,
//       courseImage,
//       courseBenefits,
//       language,
//       instructor: req.user._id,
//     });

//     await newCourse.save();

//     res.status(201).json({ message: "Course added successfully", course: newCourse });
//   } catch (error) {
//     console.error("Error adding course:", error);
//     res.status(500).json({ message: "Internal Server Error", error });
//   }
// };




// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const addCourse = async (req, res) => {
  try {
    let { title, description, price, oldPrice, discount, duration, courseSections, courseBenefits, language } = req.body;


    const parsedSections = JSON.parse(courseSections);
    const benefitsArray = courseBenefits.split(",").map(benefit => benefit.trim());

    let courseImage = null;


    if (req.file) {
      const uploadResponse = await cloudinary.uploader.upload(req.file.path, {
        folder: 'courseThumbnail',
      });
      courseImage = uploadResponse.secure_url;
    }

    oldPrice = oldPrice || price;
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

// const checkCourse = async (req, res) => {
//   try {
//     const { title } = req.body;
//     if (!title) {
//       return res.status(400).json({ success: false, message: "Course title is required" });
//     }
//     const existingCourse = await Course.findOne({title});
//     console.log(existingCourse);
//     if (existingCourse) {
//       return res.status(200).json({
//         success: true,
//         message: "Course is already available",
//         course: existingCourse,
//       });
//     } else {
//       return res.status(404).json({
//         success: false,
//         message: "Course is not available",
//       });
//     }
//   } catch (error) {
//     console.error("Error checking course:", error);
//     return res.status(500).json({
//       success: false,
//       message: "Server error",
//     });
//   }
// };


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
    const { title, description, discount, oldPrice, duration, language, courseBenefits, courseSections } = req.body;

    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({ success: false, message: "Course not found" });
    }

    const price = oldPrice - (oldPrice * (discount / 100));

    let updatedCourseImage = course.courseImage;

    if (req.file) {
      if (course.courseImage) {
        const oldImagePublicId = course.courseImage.split("/").pop().split(".")[0]; // Assuming the image filename contains the public ID.
        cloudinary.uploader.destroy(oldImagePublicId, (err, result) => {
          if (err) {
            console.error("Error deleting old image:", err);
          } else {
            console.log("Deleted old course image:", result);
          }
        });
      }

      const result = await cloudinary.uploader.upload(req.file.path);
      updatedCourseImage = result.secure_url;
    }

    course.title = title || course.title;
    course.description = description || course.description;
    course.discount = discount || course.discount;
    course.price = price || course.price;
    course.oldPrice = oldPrice || course.oldPrice;
    course.duration = duration || course.duration;
    course.language = language || course.language;
    course.courseBenefits = courseBenefits ? courseBenefits.split(",").map((benefit) => benefit.trim()) : course.courseBenefits;
    course.courseImage = updatedCourseImage;
    course.courseSections = courseSections ? JSON.parse(courseSections) : course.courseSections;


    await course.save();

    res.status(200).json({
      success: true,
      message: "Course updated successfully",
      course: course,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to update course" });
  }
};

const confirminstructor = async (req, res) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    const courseid = req.params.id;

    const course = await Course.findById(courseid).populate("instructor", "_id");

    const instructorId = course.instructor._id.toString()
    if (!course) {
      return res.status(404).json({ success: false, message: "Course not found" });
    }

    if (!course.instructor) {
      console.log("Instructor not found in course");
      return res.status(404).json({ success: false, message: "Instructor not found" });
    }

    if (!course.instructor._id) {
      console.log("Instructor ID is undefined");
      return res.status(404).json({ success: false, message: "Instructor ID not found" });
    }

    // Ensure both IDs are strings before comparing

    // if (instructorId === user) {
    if (instructorId === user) {
      res.status(200).json({ success: true, message: "You are the instructor of this course" });
    } else {
      res.status(403).json({ success: false, message: "You are not the instructor of this course" });
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
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

const deletereview = async (req, res) => {
  const { reviewId } = req.params;

  try {
    const course = await Course.findOne({ 'reviews._id': reviewId });
    if (!course) {
      return res.status(404).json({ success: false, message: 'Review not found' });
    }


    course.reviews = course.reviews.filter((review) => review._id.toString() !== reviewId);
    await course.save();

    res.status(200).json({ success: true, message: 'Review deleted successfully' });
  } catch (error) {
    console.error('Error deleting review:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

const deleteCourse = async (req, res) => {
  try {
    // Find the course by ID
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ success: false, message: "Course not found" });
    }


    if (course.courseImage) {
      const publicId = course.courseImage.split('/').pop().split('.')[0];
      await cloudinary.uploader.destroy(publicId);
      console.log("Image deleted successfully from Cloudinary");
    } else {
      console.log("No course image to delete.");
    }


    const lectures = await Lecture.find({ courseId: req.params.id });
    for (let lecture of lectures) {

      if (lecture.video) {
        const videoPath = path.join(__dirname, "../public/video/lectures", lecture.video);
        if (fs.existsSync(videoPath)) {
          fs.unlinkSync(videoPath);
          console.log(`Video deleted: ${videoPath}`);
        } else {
          console.log(`Video file not found: ${videoPath}`);
        }
      } else {
        console.log("No video file to delete for lecture:", lecture._id);
      }


      await Lecture.findByIdAndDelete(lecture._id);
    }


    await Course.findByIdAndDelete(req.params.id);

    res.status(200).json({ success: true, message: "Course and associated lectures deleted successfully" });
  } catch (error) {
    console.error("Error deleting course:", error);
    res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
};

module.exports = { deleteCourse };


const postReview = async (req, res) => {
  const { courseId } = req.params;
  const { reviewText } = req.body;

  try {
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found." });
    }

    const review = {
      user: req.user,
      reviewText,
    };

    course.reviews.push(review);
    await course.save();

    res.status(201).json({ success: true, review });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error saving review" });
  }
};

const getReviews = async (req, res) => {
  const { courseId } = req.params;

  try {
    const course = await Course.findById(courseId).populate("reviews.user", "username");
    if (!course) {
      return res.status(404).json({ message: "Course not found." });
    }

    res.status(200).json({ reviews: course.reviews });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching reviews" });
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





module.exports = {
  addCourse,
  getAllCourses,
  getCourseById,
  updateCourse,
  deleteCourse,
  updateCourse,
  lecturesvideo,
  isEncrolled,
  getAllMyCourses,
  postReview,
  getReviews,
  deletereview,
  confirminstructor
};
