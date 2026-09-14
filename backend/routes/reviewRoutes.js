const express = require("express");
const router = express.Router();
const {
  listPublicReviews,
  listAllReviews,
  createReview,
  submitPublicReview,
  updateReview,
  deleteReview,
} = require("../controllers/reviewController");
const { protect, adminOnly } = require("../middleware/auth");

router.get("/", listPublicReviews);
router.post("/public", submitPublicReview);
router.get("/all", protect, adminOnly, listAllReviews);
router.post("/", protect, adminOnly, createReview);
router.patch("/:id", protect, adminOnly, updateReview);
router.delete("/:id", protect, adminOnly, deleteReview);

module.exports = router;
