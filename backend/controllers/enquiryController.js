const Enquiry = require("../models/Enquiry");

function generateEnquiryId() {
  const year = new Date().getFullYear();
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `RTT-${year}-${rand}`;
}

exports.createEnquiry = async (req, res) => {
  try {
    const {
      fullName,
      phone,
      email,
      pickupLocation,
      dropLocation,
      travelDate,
      travelTime,
      returnDate,
      travellers,
      vehicleType,
      tripType,
      additionalRequirements,
    } = req.body;

    if (!fullName || !phone || !pickupLocation) {
      return res.status(400).json({
        success: false,
        message: "Full name, phone and pickup location are required.",
      });
    }

    let enquiryId = generateEnquiryId();
    // ensure uniqueness (extremely unlikely to collide, but be safe)
    while (await Enquiry.findOne({ enquiryId })) {
      enquiryId = generateEnquiryId();
    }

    const enquiry = await Enquiry.create({
      enquiryId,
      fullName,
      phone,
      email,
      pickupLocation,
      dropLocation,
      travelDate,
      travelTime,
      returnDate,
      travellers,
      vehicleType,
      tripType,
      additionalRequirements,
    });

    res.status(201).json({
      success: true,
      message: "Your travel request has been received.",
      enquiryId: enquiry.enquiryId,
      enquiry,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Could not submit enquiry.", error: err.message });
  }
};

// Admin listing with search/filter/pagination
exports.listEnquiries = async (req, res) => {
  const { status, search, page = 1, limit = 20 } = req.query;
  const query = {};
  if (status) query.status = status;
  if (search) {
    query.$or = [
      { fullName: new RegExp(search, "i") },
      { phone: new RegExp(search, "i") },
      { enquiryId: new RegExp(search, "i") },
    ];
  }
  const skip = (Number(page) - 1) * Number(limit);
  const [items, total] = await Promise.all([
    Enquiry.find(query).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
    Enquiry.countDocuments(query),
  ]);
  res.json({ success: true, items, total, page: Number(page), pages: Math.ceil(total / limit) });
};

exports.getEnquiry = async (req, res) => {
  const enquiry = await Enquiry.findById(req.params.id);
  if (!enquiry) return res.status(404).json({ success: false, message: "Enquiry not found." });
  res.json({ success: true, enquiry });
};

exports.updateEnquiry = async (req, res) => {
  const allowed = ["status", "internalNotes", "quote"];
  const updates = {};
  allowed.forEach((key) => {
    if (req.body[key] !== undefined) updates[key] = req.body[key];
  });
  const enquiry = await Enquiry.findByIdAndUpdate(req.params.id, updates, { new: true });
  if (!enquiry) return res.status(404).json({ success: false, message: "Enquiry not found." });
  res.json({ success: true, enquiry });
};

exports.deleteEnquiry = async (req, res) => {
  await Enquiry.findByIdAndDelete(req.params.id);
  res.json({ success: true, message: "Enquiry deleted." });
};

exports.stats = async (req, res) => {
  const statuses = Enquiry.STATUSES;
  const counts = {};
  await Promise.all(
    statuses.map(async (s) => {
      counts[s] = await Enquiry.countDocuments({ status: s });
    })
  );
  const total = await Enquiry.countDocuments({});
  res.json({ success: true, total, counts });
};

exports.trackEnquiry = async (req, res) => {
  try {
    const { enquiryId } = req.params;
    if (!enquiryId) {
      return res.status(400).json({ success: false, message: "Please provide an Enquiry ID." });
    }
    const enquiry = await Enquiry.findOne({
      enquiryId: enquiryId.trim().toUpperCase(),
    }).select("enquiryId fullName tripType travelDate pickupLocation dropLocation status quote createdAt");

    if (!enquiry) {
      return res.status(404).json({
        success: false,
        message: "No booking/enquiry found with this ID. Please check the ID (e.g. RTT-2026-XXXX).",
      });
    }

    res.json({ success: true, enquiry });
  } catch (err) {
    res.status(500).json({ success: false, message: "Could not look up enquiry.", error: err.message });
  }
};
