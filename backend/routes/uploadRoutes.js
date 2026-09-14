const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");
const { protect, adminOnly } = require("../middleware/auth");

// Admin-only image upload used everywhere in the CMS (hero, cards, gallery, logo...)
router.post("/", protect, adminOnly, upload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: "No image file received." });
  }
  const url = `/uploads/${req.file.filename}`;
  res.status(201).json({ success: true, url });
});

module.exports = router;
