const express = require("express");
const { requestInstructorRole, approveInstructor, rejectInstructor, getPendingInstructorRequests, getInstructorProfile } = require("../controllers/instructorController");
const { isAdmin, authenticateToken } = require("../middleware/isAdminMiddleware");
const upload = require("../middleware/cvmiddleware");
const router = express.Router();


router.post("/request", authenticateToken, upload.single("cv"), requestInstructorRole);
router.put("/approve/:userId", authenticateToken, isAdmin, approveInstructor);

router.put("/reject/:userId", authenticateToken, isAdmin, rejectInstructor);

router.get("/pending-instructors", authenticateToken, isAdmin, getPendingInstructorRequests);

router.get("/:id", authenticateToken, getInstructorProfile);




module.exports = router;
