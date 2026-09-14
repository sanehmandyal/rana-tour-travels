const SiteContent = require("../models/SiteContent");

// Public: get one section by key
exports.getSection = async (req, res) => {
  const doc = await SiteContent.findOne({ key: req.params.key });
  if (!doc) return res.status(404).json({ success: false, message: "Section not found." });
  res.json({ success: true, section: doc });
};

// Public: get all sections at once (used to hydrate the whole site in one call)
exports.getAllSections = async (req, res) => {
  const docs = await SiteContent.find({});
  const map = {};
  docs.forEach((d) => (map[d.key] = { label: d.label, data: d.data, updatedAt: d.updatedAt }));
  res.json({ success: true, sections: map });
};

// Admin: create or update a section (upsert) - this is how the admin edits
// every card and page: each section's `data` is replaced wholesale from
// the admin editor form.
exports.upsertSection = async (req, res) => {
  try {
    const { key } = req.params;
    const { label, data } = req.body;
    if (!data) return res.status(400).json({ success: false, message: "data is required." });

    const doc = await SiteContent.findOneAndUpdate(
      { key },
      { key, label: label || key, data, updatedBy: req.user._id },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );
    res.json({ success: true, section: doc });
  } catch (err) {
    res.status(500).json({ success: false, message: "Could not save section.", error: err.message });
  }
};

// Admin: delete a section entirely
exports.deleteSection = async (req, res) => {
  await SiteContent.findOneAndDelete({ key: req.params.key });
  res.json({ success: true, message: "Section removed." });
};
