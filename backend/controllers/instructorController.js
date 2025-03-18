const Course = require("../models/Course");
const InstructorRequest = require("../models/InstructorRequest");
const User = require("../models/User");
const cloudinary = require("../utils/cloudinaryConfig");

// Request Instructor Role with CV
exports.requestInstructorRole = async (req, res) => {
  try {
    const userId = req.user;
    const { message } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: "CV file is required" });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.role === "instructor") {
      return res.status(400).json({ message: "You are already an instructor" });
    }

    // Upload CV to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "cv",
      resource_type: "raw",
    });

    const cvUrl = result.secure_url;

    // Save Instructor Request
    const request = new InstructorRequest({
      user: userId,
      cvUrl,
      message,
    });

    await request.save();

    res.status(200).json({ message: "Instructor request sent successfully", request });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};

// Approve Instructor Request (Admin Action)
exports.approveInstructor = async (req, res) => {
  try {
    const { userId } = req.params;
    const requestedUser = await User.findById(userId);

    if (!requestedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    if (requestedUser.role === "admin") {
      return res.status(400).json({ message: "User is already an admin" });
    }
    if (requestedUser.role === "instructor") {
      return res.status(400).json({ message: "User is already an instructor" });
    }

    requestedUser.role = "instructor";
    await requestedUser.save();

    const request = await InstructorRequest.findOne({ user: userId });
    if (!request) {
      return res.status(404).json({ message: "Instructor request not found" });
    }

    request.status = "approved";
    await request.save(); // Save the updated request

    res.status(200).json({ message: "Instructor request approved successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};

exports.rejectInstructor = async (req, res) => {
  try {
    const { userId } = req.params;
    const requestedUser = await User.findById(userId);

    if (!requestedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const request = await InstructorRequest.findOne({ user: userId });
    if (!request) {
      return res.status(404).json({ message: "Instructor request not found" });
    }

    request.status = "rejected";
    await request.save(); // Save the updated request

    res.status(200).json({ message: "Instructor request rejected successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};


// Get Pending Instructor Requests
exports.getPendingInstructorRequests = async (req, res) => {
  
  try {
    const pendingRequests = await InstructorRequest.find({ status: "pending" })
      .populate("user", "username email _id")
      .select("cvUrl message status createdAt");
      

    res.status(200).json({ pendingRequests });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};
  
  exports.getInstructorProfile = async (req, res) => {
    try {
      const instructorId = req.params.id;
  
      // Fetch instructor details
      const instructor = await User.findById(instructorId).select("username email photoUrl");
      if (!instructor) {
        return res.status(404).json({ success: false, message: "Instructor not found" });
      }
  
      // Fetch courses by the instructor
      const courses = await Course.find({ instructor: instructorId }).select("title description courseImage");
  
      res.status(200).json({ success: true, instructor, courses });
    } catch (error) {
      console.error("Error fetching instructor profile:", error);
      res.status(500).json({ success: false, message: "Internal Server Error" });
    }
  };