const multer = require("multer");

const storage = multer.diskStorage({});
const fileFilter = (req, file, cb) => {
  if (file.mimetype === "application/pdf") {
    cb(null, true);
  } else {
    cb(new Error("Only PDF files are allowed"), false);
  }
};

const upload = multer({
  storage,
  limits: { fileSize: 100 * 1024 }, // 100 KB limit
  fileFilter,
});

module.exports = upload;
