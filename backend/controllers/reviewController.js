const Review = require("../models/Review");

exports.listPublicReviews = async (req, res) => {
  const reviews = await Review.find({ visible: true }).sort({ order: 1, createdAt: -1 });
  res.json({ success: true, reviews });
};

exports.listAllReviews = async (req, res) => {
  const reviews = await Review.find({}).sort({ order: 1, createdAt: -1 });
  res.json({ success: true, reviews });
};

exports.createReview = async (req, res) => {
  const review = await Review.create(req.body);
  res.status(201).json({ success: true, review });
};

exports.submitPublicReview = async (req, res) => {
  try {
    const { author, rating, text, tripType } = req.body;
    if (!author || !rating || !text) {
      return res.status(400).json({ success: false, message: "Please provide your name, rating, and review message." });
    }
    const numRating = Number(rating);
    if (isNaN(numRating) || numRating < 1 || numRating > 5) {
      return res.status(400).json({ success: false, message: "Rating must be between 1 and 5 stars." });
    }

    const reviewText = tripType ? `[${tripType}] ${text.trim()}` : text.trim();

    const review = await Review.create({
      author: author.trim(),
      rating: Math.round(numRating),
      text: reviewText,
      source: "Testimonial",
      visible: true,
      order: 0,
    });
    res.status(201).json({ success: true, review, message: "Thank you! Your review has been published." });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateReview = async (req, res) => {
  const review = await Review.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!review) return res.status(404).json({ success: false, message: "Review not found." });
  res.json({ success: true, review });
};

exports.deleteReview = async (req, res) => {
  await Review.findByIdAndDelete(req.params.id);
  res.json({ success: true, message: "Review deleted." });
};
