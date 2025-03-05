const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  instructor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  enrolledStudents: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  price: {
    type: Number,
    required: true,
  },
  oldPrice: {
    type: Number,
  },
  discount: {
    type: Number,
    default: function () {
      if (this.oldPrice) {
        return Math.round(((this.oldPrice - this.price) / this.oldPrice) * 100);
      }
      return 0;
    },
  },
  duration: {
    type: String,
    required: true,
  },
  courseSections: [
    {
      sectionTitle: String,
      lessons: [
        {
          title: String,
          duration: String,
          icon: String,
        },
      ],
    },
  ],
  courseImage: {
    type: String,
  },
  courseBenefits: [
    {
      type: String,
    },
  ],
  language: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Course", courseSchema);
