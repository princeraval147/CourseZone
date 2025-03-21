const express = require("express");
const authenticateUser = require("../middleware/authMiddleware");
const Chat = require("../models/chatSchema"); 
const router = express.Router();


router.post("/send/:courseId", authenticateUser, async (req, res) => {
  const { courseId } = req.params;
  const { message, replyTo } = req.body; // Accept replyTo field
  const userId = req.user;

  if (!message) {
    return res.status(400).json({ error: "Message cannot be empty" });
  }

  try {
    const newMessage = new Chat({
      sender: userId,
      course: courseId,
      message,
      replyTo: replyTo || null, // Store the message being replied to (if provided)
    });

    await newMessage.save();
    res.status(201).json(newMessage);
  } catch (error) {
    console.error("Error saving message:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});



router.get("/:courseId", authenticateUser, async (req, res) => {
  try {
    const { courseId } = req.params;

    const messages = await Chat.find({ course: courseId })
      .populate("sender", "username")
      .populate("replyTo", "message sender");

    res.status(200).json(messages);
  } catch (error) {
    console.error("Error fetching messages:", error.message);
    res.status(500).json({ message: "Server error", error });
  }
});


module.exports = router;
