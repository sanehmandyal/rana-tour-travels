const mongoose = require("mongoose");

/**
 * SiteContent is a flexible, section-based CMS collection.
 * Every editable area of the public site (hero, services, destinations,
 * packages, gallery, about, contact, footer, settings, faqs...) is stored
 * as one document identified by `key`. `data` holds whatever shape that
 * section needs (usually { items: [...] } or a plain object of fields).
 *
 * This is what lets the admin edit "every card and page" from one place
 * without needing a bespoke model + route + editor per content type.
 */
const SiteContentSchema = new mongoose.Schema(
  {
    key: { type: String, required: true, unique: true, index: true },
    label: { type: String, required: true },
    data: { type: mongoose.Schema.Types.Mixed, default: {} },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("SiteContent", SiteContentSchema);
