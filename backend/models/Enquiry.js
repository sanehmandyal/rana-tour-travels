const mongoose = require("mongoose");

const STATUSES = [
  "New",
  "Contacted",
  "Quote Sent",
  "Awaiting Confirmation",
  "Confirmed",
  "In Progress",
  "Completed",
  "Cancelled",
];

const EnquirySchema = new mongoose.Schema(
  {
    enquiryId: { type: String, required: true, unique: true, index: true },
    fullName: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true, index: true },
    email: { type: String, trim: true, lowercase: true },
    pickupLocation: { type: String, required: true },
    dropLocation: { type: String },
    travelDate: { type: Date },
    travelTime: { type: String },
    returnDate: { type: Date },
    travellers: { type: Number, default: 1 },
    vehicleType: { type: String },
    tripType: {
      type: String,
      enum: [
        "One Way",
        "Round Trip",
        "Local",
        "Airport Transfer",
        "Outstation",
        "Sightseeing",
        "Corporate",
        "Group Travel",
      ],
      default: "One Way",
    },
    additionalRequirements: { type: String },
    status: { type: String, enum: STATUSES, default: "New", index: true },
    internalNotes: { type: String },
    quote: {
      amount: Number,
      notes: String,
      sentAt: Date,
    },
    createdAt: { type: Date, default: Date.now, index: true },
  },
  { timestamps: true }
);

EnquirySchema.statics.STATUSES = STATUSES;

module.exports = mongoose.model("Enquiry", EnquirySchema);
