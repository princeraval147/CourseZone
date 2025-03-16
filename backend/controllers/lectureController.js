const Lecture = require("../models/Lecture");
const Course = require("../models/Course");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const dir = "public/video/coursevideo";
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        cb(null, dir);
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});

const upload = multer({ storage });

const addLecture = async (req, res) => {
    try {
        const { courseId, lectureTitle, isPreviewFree } = req.body;
        if (!req.file) {
            return res.status(400).json({ message: "Lecture video is required" });
        }

        const videoUrl = `/video/coursevideo/${req.file.filename}`;

        const newLecture = new Lecture({
            lectureTitle,
            videoUrl,
            isPreviewFree,
        });

        const savedLecture = await newLecture.save();

        await Course.findByIdAndUpdate(courseId, {
            $push: { lectures: savedLecture._id },
        });

        res.status(201).json({ message: "Lecture added successfully", lecture: savedLecture });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error });
    }
};

const updateLecture = async (req, res) => {
    try {
        const { lectureId } = req.params;
        const { lectureTitle, isPreviewFree } = req.body;

        const lecture = await Lecture.findById(lectureId);
        if (!lecture) return res.status(404).json({ message: "Lecture not found" });

        if (req.file) {
            // Delete old video file
            if (lecture.videoUrl) {
                const oldPath = `public${lecture.videoUrl}`;
                if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
            }
            lecture.videoUrl = `/video/coursevideo/${req.file.filename}`;
        }

        lecture.lectureTitle = lectureTitle || lecture.lectureTitle;
        lecture.isPreviewFree = isPreviewFree !== undefined ? isPreviewFree : lecture.isPreviewFree;

        const updatedLecture = await lecture.save();
        res.json({ message: "Lecture updated", lecture: updatedLecture });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error });
    }
};

const deleteLecture = async (req, res) => {
    try {
        const { lectureId, courseId } = req.params;

        const lecture = await Lecture.findById(lectureId);
        if (!lecture) return res.status(404).json({ message: "Lecture not found" });


        if (lecture.videoUrl) {
            const filePath = `public${lecture.videoUrl}`;
            if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
        }

        await Lecture.findByIdAndDelete(lectureId);
        await Course.findByIdAndUpdate(courseId, { $pull: { lectures: lectureId } });

        res.json({ message: "Lecture deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error });
    }
};

module.exports = { upload, addLecture, updateLecture, deleteLecture };
