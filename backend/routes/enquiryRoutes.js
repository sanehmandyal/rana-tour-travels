const express = require("express");
const rateLimit = require("express-rate-limit");
const router = express.Router();
const {
  createEnquiry,
  listEnquiries,
  getEnquiry,
  updateEnquiry,
  deleteEnquiry,
  stats,
} = require("../controllers/enquiryController");
const { protect, adminOnly } = require("../middleware/auth");

const enquiryLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 15,
  message: { success: false, message: "Too many enquiries submitted. Please try again later." },
});

router.post("/", enquiryLimiter, createEnquiry);
router.get("/stats/summary", protect, adminOnly, stats);
router.get("/", protect, adminOnly, listEnquiries);
router.get("/:id", protect, adminOnly, getEnquiry);
router.patch("/:id", protect, adminOnly, updateEnquiry);
router.delete("/:id", protect, adminOnly, deleteEnquiry);

module.exports = router;
