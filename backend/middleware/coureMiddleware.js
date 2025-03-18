const User = require("../models/User");

const checkEnrollment = async (req, res, next) => {
  try {
    const userId = req.user;
    const { courseId } = req.params;

    const user = await User.findById(userId).populate("enrolledCourses");
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const isEnrolled = user.enrolledCourses.some(
      (course) => course._id.toString() === courseId
    );

    if (isEnrolled) {
      req.isEnrolled = true;
    } else {
      req.isEnrolled = false;
    }
    next();
  } catch (error) {
    console.error("Error checking enrollment:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

module.exports = checkEnrollment;