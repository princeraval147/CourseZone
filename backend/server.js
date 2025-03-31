const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const courseRoutes = require("./routes/courseRoute");
const lectureRoutes = require("./routes/lectureRoutes");
const instructorRoutes = require("./routes/instructorRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const chatRoutes = require("./routes/chatRoutes");
// const Razorpay = require("razorpay");
// const crypto = require('crypto');
const path = require("path");
const http = require("http");
const { Server } = require("socket.io");
const Chat = require("./models/chatSchema");

dotenv.config();
connectDB();

const app = express();
const server = http.createServer(app);

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));

app.get('/image/course-thumbnail/:imageName', (req, res) => {
    const imageName = req.params.imageName;
    const imagePath = path.join(__dirname, 'public/image/course-thumbnail', imageName);

    res.sendFile(imagePath, (err) => {
        if (err) {
            res.status(404).send('Image not found');
        }
    });
});
app.use("/video", express.static("public/video"));
app.use("/images/course-thumbnail", express.static(path.join(__dirname, "images/course-thumbnail")));

app.use("/api/auth", authRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/lectures", lectureRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/instructor", instructorRoutes);
app.use("/api/chat", chatRoutes);

// Socket.IO Setup
const io = new Server(server, {
    cors: { origin: process.env.CLIENT_URL, credentials: true },
});

io.on("connection", (socket) => {
    // console.log("🔵 New user connected:", socket.id);

    socket.on("joinRoom", (courseId) => {
        socket.join(courseId);
        // console.log(`📢 User joined course chat: ${courseId}`);
    });

    socket.on("sendMessage", async ({ courseId, message, user }) => {
        try {
            if (!courseId || !message || !user) return;

            // Save message to DB
            const chatMessage = new Chat({
                course: courseId,
                sender: user._id,
                message,
            });

            await chatMessage.save();

            // Emit message to all users in the room
            io.to(courseId).emit("receiveMessage", {
                _id: chatMessage._id,
                course: chatMessage.course,
                sender: { _id: user._id, username: user.username },
                message: chatMessage.message,
                createdAt: chatMessage.createdAt,
            });
        } catch (error) {
            // console.error("❌ Error saving message:", error);
        }
    });

    socket.on("disconnect", () => {
        // console.log("🔴 User disconnected:", socket.id);
    });
});



// app.listen(5000, () => console.log("Server running on port 5000")); 
server.listen(5000, () => console.log("🚀 Server running on port 5000"));
