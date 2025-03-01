const jwt = require("jsonwebtoken");
const User = require("../models/User.js");

const authenticateAdmin = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ message: "Unauthorized. No token provided." });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET); 
    console.log(decoded);
    const user = await User.findById(decoded.userId)
    console.log(user);
    if (!user || user.role !== "instructor") {
      return res.status(403).json({ message: "Access denied. Only instructors can create courses." });
    }

    req.user = user; 
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
};

module.exports = authenticateAdmin;
