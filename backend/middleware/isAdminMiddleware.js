const jwt = require("jsonwebtoken");
const User = require("../models/User");

exports.authenticateToken = (req, res, next) => {
    const token = req.cookies.token;

    if (!token) return res.status(401).json({ message: "Unauthorized: No token provided" });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded.userId;
        next();
    } catch (error) {
        res.status(401).json({ message: "Invalid token" });
    }
};


exports.isAdmin = async (req, res, next) => {
    try {
        const user = await User.findById(req.user);
        if (!user || user.role !== "admin") {
            return res.status(403).json({ message: "Access denied. Admins only" });
        }
        next();
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
    }
};
