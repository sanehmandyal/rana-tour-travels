const mongoose = require("mongoose");

const ReviewSchema = new mongoose.Schema(
  {
    author: { type: String, required: true, trim: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    text: { type: String, required: true },
    source: { type: String, default: "Google", enum: ["Google", "Testimonial"] },
    visible: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Review", ReviewSchema);
