const mongoose = require("mongoose");

const CourseSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    feature: { type: [String], required: true },
    price: { type: Number, required: true },
    oldPrice: { type: Number, required: true },
    language: { type: String, required: true },
    certificate: { type: Boolean, required: true },
    totalContent: { type: String, required: true },
    thumbnail: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: [String], required: true },
    enrolledStudents: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    lectures: [{ type: mongoose.Schema.Types.ObjectId, ref: "Lecture" }],
    creator: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    isPublished: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Course", CourseSchema);
