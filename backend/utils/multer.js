const multer = require("multer");

// Store files in memory for direct Cloudinary upload
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

module.exports = upload;
