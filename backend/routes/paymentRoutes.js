const express = require("express");
const { createOrder, verifyPayment, paymentsuccess, getEnrolledStudents, getAllEnrolledStudents } = require("../controllers/razorpayController");
const authMiddleware = require("../middleware/authMiddleware");
const authenticateAdmin = require("../middleware/adminMiddleware");
const { isAdmin, authenticateToken } = require("../middleware/isAdminMiddleware");

const router = express.Router();

router.post("/create-order", authMiddleware, createOrder);
router.post("/verify-payment", authMiddleware, verifyPayment);
router.post("/payment-success", authMiddleware, paymentsuccess);
router.get("/enrolled-students", authenticateAdmin, getEnrolledStudents);
router.get("/allenrolled-students", authenticateToken, isAdmin, getAllEnrolledStudents);

module.exports = router;
