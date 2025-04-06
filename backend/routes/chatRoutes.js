const express = require("express");
const authenticateUser = require("../middleware/authMiddleware");
const Chat = require("../models/chatSchema");

const router = express.Router();

// POST: Send a message
router.post("/send/:courseId", authenticateUser, async (req, res) => {
  console.log("Received message:", req.body);
  const { courseId } = req.params;
  const { message, replyTo } = req.body;
  const userId = req.user;

  if (!message) {
    return res.status(400).json({ error: "Message cannot be empty" });
  }

  try {
    const newMessage = new Chat({
      sender: userId,
      course: courseId,
      message,
      replyTo: replyTo || null,
    });

    const savedMessage = await newMessage.save();

    // Populate sender and replyTo fields
    const populatedMessage = await Chat.findById(savedMessage._id)
      .populate("sender", "username")
      .populate({
        path: "replyTo",
        select: "message sender",
        populate: { path: "sender", select: "username" },
      });

    res.status(201).json(populatedMessage);
  } catch (error) {
    console.error("Error saving message:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET: Fetch messages for a course
router.get("/:courseId", authenticateUser, async (req, res) => {
  try {
    const { courseId } = req.params;

    const messages = await Chat.find({ course: courseId })
      .populate("sender", "username")
      .populate({
        path: "replyTo",
        select: "message sender",
        populate: { path: "sender", select: "username" },
      });

    res.status(200).json(messages);
  } catch (error) {
    console.error("Error fetching messages:", error.message);
    res.status(500).json({ message: "Server error", error });
  }
});

module.exports = router;
