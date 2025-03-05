const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const sendEmail = require("../utils/sendEmail");
const { uploadMedia, deleteMediaFromCloudinary } = require("../utils/cloudinary");


// Register User & Send OTP
exports.register = async (req, res) => {
  const { username, email, password } = req.body;
  try {
    let user = await User.findOne({ email });

    if (user) {
      if (!user.isVerified) {
        return res.status(400).json({ message: "User already registered. Please verify OTP." });
      }
      return res.status(400).json({ message: "Email already exists." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    console.log(otp);
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000);

    user = new User({ username, email, password: hashedPassword, otp, otpExpires });

    await user.save();
    // sendEmail(email, otp);

    res.json({ message: "User registered! Please verify OTP." });
  } catch (error) {
    res.status(500).json({ message: "Serverrrrrrrrrr error", error });
  }
};

// Verify OTP
exports.verifyOTP = async (req, res) => {
  const { email, otp } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) return res.status(400).json({ message: "User not found." });
    if (user.otp !== otp) return res.status(400).json({ message: "Invalid OTP." });
    if (user.otpExpires < Date.now()) return res.status(400).json({ message: "OTP expired. Request a new OTP." });

    user.isVerified = true;
    user.otp = null;
    user.otpExpires = null;
    await user.save();

    res.json({ message: "OTP Verified! You can now log in." });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};


// Login User & Set JWT in HTTP-only Cookie
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user || !user.isVerified) {
      return res.status(400).json({ message: "Invalid credentials or unverified email." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials." });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Set true in production
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    });

    res.json({ message: "Login successful", token });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};


// Logout User (Clear JWT Cookie)
exports.logout = (req, res) => {
  res.clearCookie("token");
  res.json({ message: "Logged out successfully" });
};

const otpStore = {}; // Temporary OTP storage

// Forgot Password: Generate OTP
exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (!user) return res.status(400).json({ message: "Email not registered" });

  const otp = Math.floor(100000 + Math.random() * 900000);
  otpStore[email] = otp;
  console.log(otp, email);
  // await sendOTP(email, otp); // Function to send OTP via email
  res.json({ message: "OTP sent to your email" });
};

// Reset Password: Verify OTP & Update Password
exports.resetPassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;

  console.log("Received OTP:", otp, "Stored OTP:", otpStore[email]);

  if (!otpStore[email]) {
    return res.status(400).json({ message: "OTP expired or not found" });
  }

  if (parseInt(otp) !== otpStore[email]) {
    return res.status(400).json({ message: "Invalid OTP" });
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(newPassword, salt);

  await User.updateOne({ email }, { password: hashedPassword });
  delete otpStore[email];

  res.json({ message: "Password reset successfully" });
};

// Get User Profile
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user).select("-password"); // Use userId, not id
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// Get User Profile (Protected Route)
exports.authenticate = async (req, res) => {
  try {
    // `req.user` contains the decoded token data from `authenticateToken` middleware
    const user = await User.findById(req.user.id).select("-password"); // Exclude password

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

// Update User Profile 
exports.updateProfile = async (req, res) => {
  try {
    const userId = req.user; // User ID from token
    const { username, oldPassword, newPassword } = req.body;
    const profilePhoto = req.file;

    // Find user by ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
    }

    // Handle password update if oldPassword and newPassword are provided
    if (oldPassword && newPassword) {
      const isMatch = await bcrypt.compare(oldPassword, user.password);
      if (!isMatch) {
        return res.status(400).json({
          message: "Old password is incorrect",
          success: false,
        });
      }

      // Hash the new password before updating
      const hashedPassword = await bcrypt.hash(newPassword, 12);
      user.password = hashedPassword;
    }

    // Delete old photo from Cloudinary if exists
    if (user.photoUrl) {
      const publicId = user.photoUrl.split("/").pop().split(".")[0];
      await deleteMediaFromCloudinary(publicId);
    }

    // Upload new photo
    let photoUrl = user.photoUrl;
    if (profilePhoto) {
      const cloudResponse = await uploadMedia(profilePhoto.buffer);
      if (!cloudResponse || !cloudResponse.secure_url) {
        return res.status(500).json({
          success: false,
          message: "Failed to upload image to Cloudinary",
        });
      }
      photoUrl = cloudResponse.secure_url;
    }

    // Update user data
    const updatedData = { username, photoUrl, password: user.password };
    const updatedUser = await User.findByIdAndUpdate(userId, updatedData, { new: true }).select("-password");

    return res.status(200).json({
      success: true,
      user: updatedUser,
      message: "Profile updated successfully.",
    });
  } catch (error) {
    console.error("Update Profile Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update profile",
    });
  }
};


// Get User Role
exports.userrole = async (req, res) => {
  person = req.user;
  userdata = await User.findById(person);
  role = userdata.role;
  res.json(role);
};

//isloggedin or not
exports.isLoggedIn = (req, res) => {
  res.status(200).json({ message: "User is logged in", userId: req.user });
};