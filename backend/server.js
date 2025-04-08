const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const path = require("path");
const http = require("http");
const { Server } = require("socket.io");

// Routes
const authRoutes = require("./routes/authRoutes");
const courseRoutes = require("./routes/courseRoute");
const lectureRoutes = require("./routes/lectureRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const instructorRoutes = require("./routes/instructorRoutes");
const chatRoutes = require("./routes/chatRoutes");

// Models
const Chat = require("./models/chatSchema");

// Load environment variables and connect to DB
dotenv.config();
connectDB();

// Express setup
const app = express();
const server = http.createServer(app);

// Middleware
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
// Routes
app.use("/api/auth", authRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/lectures", lectureRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/instructor", instructorRoutes);
app.use("/api/chat", chatRoutes);

// Setup Socket.IO
const io = new Server(server, {
    cors: {
        origin: process.env.CLIENT_URL,
        credentials: true,
    },
});

app.set("io", io);

io.on("connection", (socket) => {
    console.log(`✅ Socket connected: ${socket.id}`);

    socket.on("joinRoom", (courseId) => {
        socket.join(courseId);
        console.log(`👥 User joined room: ${courseId}`);
    });

    socket.on("sendMessage", async ({ courseId, message, user }) => {
        try {
            if (!courseId || !message || !user) return;

            const chatMessage = new Chat({
                course: courseId,
                sender: user._id,
                message,
            });

            // await chatMessage.save();

            io.to(courseId).emit("receiveMessage", {
                _id: chatMessage._id,
                course: chatMessage.course,
                sender: { _id: user._id, username: user.username },
                message: chatMessage.message,
                createdAt: chatMessage.createdAt,
            });
        } catch (err) {
            console.error("❌ Error in sendMessage socket:", err);
        }
    });

    socket.on("disconnect", () => {
        console.log(`❌ Socket disconnected: ${socket.id}`);
    });
});

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
