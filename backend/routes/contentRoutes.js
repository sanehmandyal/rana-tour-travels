const express = require("express");
const router = express.Router();
const {
  getSection,
  getAllSections,
  upsertSection,
  deleteSection,
} = require("../controllers/contentController");
const { protect, adminOnly } = require("../middleware/auth");

router.get("/", getAllSections);
router.get("/:key", getSection);
router.put("/:key", protect, adminOnly, upsertSection);
router.delete("/:key", protect, adminOnly, deleteSection);

module.exports = router;
