const express = require("express");
const { upload, addLecture, updateLecture, deleteLecture } = require("../controllers/LectureController");
const router = express.Router();
// const { upload, addLecture, updateLecture, deleteLecture } = require("../controllers/lectureController");

router.post("/add", upload.single("lectureVideo"), addLecture);
router.put("/update/:lectureId", upload.single("lectureVideo"), updateLecture);
router.delete("/delete/:courseId/:lectureId", deleteLecture);

module.exports = router;