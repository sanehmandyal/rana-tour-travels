import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Plus, Trash2, Save, Loader2, GripVertical, RotateCcw, MapPin, Tag } from "lucide-react";
import client from "../api/client";
import ImageUploader from "./ImageUploader";
import {
  DEFAULT_SETTINGS,
  DEFAULT_HERO,
  DEFAULT_SERVICES,
  DEFAULT_DESTINATIONS,
  DEFAULT_PACKAGES,
  DEFAULT_GALLERY,
  DEFAULT_WHY_US,
  DEFAULT_FAQS,
  DEFAULT_ABOUT,
} from "../data/defaultContent";

const TEMPLATES = {
  hero: DEFAULT_HERO,
  about: DEFAULT_ABOUT,
  settings: DEFAULT_SETTINGS,
  services: { items: DEFAULT_SERVICES },
  destinations: { items: DEFAULT_DESTINATIONS },
  packages: { items: DEFAULT_PACKAGES },
  whyUs: { items: DEFAULT_WHY_US },
  faqs: { items: DEFAULT_FAQS },
  gallery: { items: DEFAULT_GALLERY },
  footer: { note: "Explore Himachal Pradesh with Rana Tour And Travels." },
};

// Sections whose `data` is a plain object of fields rather than a { items: [...] } list
const FIELD_SECTIONS = {
  hero: [
    { key: "headline", label: "Headline", type: "text" },
    { key: "subheading", label: "Subheading", type: "textarea" },
    { key: "backgroundImage", label: "Background Image", type: "image" },
  ],
  about: [
    { key: "ourStory", label: "Our Story", type: "textarea" },
    { key: "ourApproach", label: "Our Approach", type: "textarea" },
    { key: "whyChooseUs", label: "Why Customers Choose Us", type: "textarea" },
  ],
  settings: [
    { key: "name", label: "Business Name", type: "text" },
    { key: "tagline", label: "Tagline", type: "text" },
    { key: "phone", label: "Phone", type: "text" },
    { key: "whatsapp", label: "WhatsApp Number (with country code, no +)", type: "text" },
    { key: "address", label: "Address", type: "textarea" },
    { key: "category", label: "Category", type: "text" },
    { key: "rating", label: "Google Rating", type: "text" },
    { key: "reviewCount", label: "Review Count", type: "text" },
    { key: "googleMapsUrl", label: "Google Maps URL", type: "text" },
    { key: "email", label: "Email (optional)", type: "text" },
  ],
  footer: [{ key: "note", label: "Footer Note", type: "textarea" }],
};

const SECTION_TITLES = {
  hero: "Homepage Hero",
  about: "About Page",
  settings: "Business Settings",
  footer: "Footer",
  services: "Services",
  destinations: "Destinations",
  packages: "Tour Packages",
  whyUs: "Why Travel With RANA",
  faqs: "FAQs",
  gallery: "Gallery",
};

export default function SectionEditor() {
  const { key } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedMsg, setSavedMsg] = useState("");

  const isListSection = !FIELD_SECTIONS[key];

  useEffect(() => {
    setLoading(true);
    client
      .get(`/content/${key}`)
      .then(({ data: res }) => {
        if (res.section?.data) {
          setData(res.section.data);
        } else {
          setData(TEMPLATES[key] || (isListSection ? { items: [] } : {}));
        }
      })
      .catch(() => setData(TEMPLATES[key] || (isListSection ? { items: [] } : {})))
      .finally(() => setLoading(false));
  }, [key, isListSection]);

  const save = async () => {
    setSaving(true);
    setSavedMsg("");
    try {
      await client.put(`/content/${key}`, { label: SECTION_TITLES[key] || key, data });
      setSavedMsg("Saved successfully to database.");
    } catch (err) {
      setSavedMsg(err.response?.data?.message || "Could not save.");
    } finally {
      setSaving(false);
      setTimeout(() => setSavedMsg(""), 4000);
    }
  };

  const resetToTemplate = () => {
    if (!TEMPLATES[key]) return;
    if (confirm("Reset this section to the system template defaults with all images and details?")) {
      setData(JSON.parse(JSON.stringify(TEMPLATES[key])));
    }
  };

  if (loading || !data) return <div className="text-navy/50 py-10">Loading section data...</div>;

  return (
    <div className="max-w-4xl">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="font-display text-2xl font-bold text-navy">{SECTION_TITLES[key] || key}</h1>
          <p className="text-navy/50 text-xs mt-0.5">
            Add, delete, reorder, and update text, photos, badges, and map links.
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          {TEMPLATES[key] && (
            <button
              type="button"
              onClick={resetToTemplate}
              className="btn-outline !py-2 !px-3 text-xs flex items-center gap-1.5"
              title="Reset to default images and template"
            >
              <RotateCcw size={14} /> Restore Template
            </button>
          )}
          <button
            onClick={save}
            disabled={saving}
            className="btn-primary flex items-center gap-2 !py-2 !px-5 text-sm"
          >
            {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />} Save Changes
          </button>
        </div>
      </div>

      {savedMsg && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm font-semibold p-3 rounded-xl mb-4">
          ✓ {savedMsg}
        </div>
      )}

      {isListSection ? (
        <ListEditor
          sectionKey={key}
          items={data.items || []}
          onChange={(items) => setData({ ...data, items })}
        />
      ) : (
        <FieldEditor fields={FIELD_SECTIONS[key]} data={data} onChange={setData} />
      )}
    </div>
  );
}

function FieldEditor({ fields, data, onChange }) {
  const update = (k, v) => onChange({ ...data, [k]: v });
  return (
    <div className="card p-6 space-y-5">
      {fields.map((f) => (
        <div key={f.key}>
          {f.type === "image" ? (
            <div className="space-y-2">
              <ImageUploader label={f.label} value={data[f.key] || ""} onChange={(v) => update(f.key, v)} />
              <div>
                <span className="text-xs text-navy/50 block mb-1">Or direct Image Path / URL:</span>
                <input
                  className="input text-xs font-mono"
                  placeholder="e.g. /images/hero-himachal.jpg"
                  value={data[f.key] || ""}
                  onChange={(e) => update(f.key, e.target.value)}
                />
              </div>
            </div>
          ) : (
            <label className="block">
              <span className="text-xs font-semibold text-navy/60 block mb-1">{f.label}</span>
              {f.type === "textarea" ? (
                <textarea
                  rows={4}
                  className="input"
                  value={data[f.key] || ""}
                  onChange={(e) => update(f.key, e.target.value)}
                />
              ) : (
                <input
                  className="input"
                  value={data[f.key] || ""}
                  onChange={(e) => update(f.key, e.target.value)}
                />
              )}
            </label>
          )}
        </div>
      ))}
      <style>{`.input { border: 1px solid #e2e8ea; border-radius: 10px; padding: 0.6rem 0.8rem; width: 100%; font-size: 0.9rem; outline: none; } .input:focus { border-color: #087F78; }`}</style>
    </div>
  );
}

function ListEditor({ sectionKey, items, onChange }) {
  const updateItem = (i, patch) => {
    const next = [...items];
    next[i] = { ...next[i], ...patch };
    onChange(next);
  };

  const remove = (i) => {
    const itemTitle = items[i]?.title || `Item ${i + 1}`;
    if (confirm(`Delete "${itemTitle}"? This will be removed when you save.`)) {
      onChange(items.filter((_, idx) => idx !== i));
    }
  };

  const add = () => {
    onChange([
      ...items,
      {
        title: "",
        description: "",
        image: "",
        badge: "",
        mapUrl: "",
        price: "",
      },
    ]);
  };

  const move = (i, dir) => {
    const j = i + dir;
    if (j < 0 || j >= items.length) return;
    const next = [...items];
    [next[i], next[j]] = [next[j], next[i]];
    onChange(next);
  };

  const isDestinations = sectionKey === "destinations";
  const isPackages = sectionKey === "packages";

  return (
    <div className="space-y-4">
      {items.map((item, i) => (
        <div key={i} className="card p-5 border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <GripVertical size={16} className="text-navy/40" />
              <span className="font-display font-bold text-sm text-navy">
                #{i + 1} {item.title || "Untitled Item"}
              </span>
              {item.badge && (
                <span className="text-[10px] font-bold bg-navy text-white px-2 py-0.5 rounded-full">
                  {item.badge}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => move(i, -1)}
                disabled={i === 0}
                className="px-2 py-1 bg-slate-100 hover:bg-slate-200 rounded text-xs text-navy/70 disabled:opacity-30"
                title="Move Up"
              >
                ↑
              </button>
              <button
                type="button"
                onClick={() => move(i, 1)}
                disabled={i === items.length - 1}
                className="px-2 py-1 bg-slate-100 hover:bg-slate-200 rounded text-xs text-navy/70 disabled:opacity-30"
                title="Move Down"
              >
                ↓
              </button>
              <button
                type="button"
                onClick={() => remove(i)}
                className="p-1.5 text-red-500 hover:bg-red-50 rounded-md transition"
                title="Delete item"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>

          <div className="grid md:grid-cols-12 gap-5">
            {/* Fields column */}
            <div className="md:col-span-7 space-y-3">
              <label className="block">
                <span className="text-xs font-bold text-navy/70 block mb-1">Title</span>
                <input
                  className="input"
                  placeholder="e.g. Manali / Airport Taxi / Kullu Valley"
                  value={item.title || ""}
                  onChange={(e) => updateItem(i, { title: e.target.value })}
                />
              </label>

              <label className="block">
                <span className="text-xs font-bold text-navy/70 block mb-1">Description</span>
                <textarea
                  rows={2}
                  className="input"
                  placeholder="Brief description..."
                  value={item.description || ""}
                  onChange={(e) => updateItem(i, { description: e.target.value })}
                />
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <label className="block">
                  <span className="text-xs font-bold text-navy/70 mb-1 flex items-center gap-1">
                    <Tag size={12} className="text-orange" /> Badge / Tag
                  </span>
                  <input
                    className="input text-xs"
                    placeholder="e.g. Most Popular / Best Seller"
                    value={item.badge || ""}
                    onChange={(e) => updateItem(i, { badge: e.target.value })}
                  />
                </label>

                {isPackages && (
                  <label className="block">
                    <span className="text-xs font-bold text-navy/70 block mb-1">Price Tag</span>
                    <input
                      className="input text-xs"
                      placeholder="e.g. Quote On Request / ₹14,999"
                      value={item.price || ""}
                      onChange={(e) => updateItem(i, { price: e.target.value })}
                    />
                  </label>
                )}

                {(isDestinations || item.mapUrl !== undefined) && (
                  <label className="block sm:col-span-2">
                    <span className="text-xs font-bold text-navy/70 mb-1 flex items-center gap-1">
                      <MapPin size={12} className="text-teal" /> Google Maps Link
                    </span>
                    <input
                      className="input text-xs font-mono"
                      placeholder="https://www.google.com/maps/search/?api=1&query=..."
                      value={item.mapUrl || ""}
                      onChange={(e) => updateItem(i, { mapUrl: e.target.value })}
                    />
                  </label>
                )}
              </div>
            </div>

            {/* Image Column */}
            <div className="md:col-span-5 space-y-3 bg-slate-50/70 p-4 rounded-xl border border-slate-100">
              <span className="text-xs font-bold text-navy/70 block">Card Photography</span>
              <ImageUploader
                value={item.image || ""}
                onChange={(v) => updateItem(i, { image: v })}
                label="Upload File"
              />
              <div>
                <span className="text-[11px] text-navy/50 block mb-1">Or direct Image URL / Path:</span>
                <input
                  className="input text-xs font-mono"
                  placeholder="e.g. /images/destinations/manali.jpg"
                  value={item.image || ""}
                  onChange={(e) => updateItem(i, { image: e.target.value })}
                />
              </div>
              {item.image && (
                <div className="h-28 rounded-lg overflow-hidden border border-slate-200 relative group">
                  <img src={item.image} alt="" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-semibold">
                    Preview
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      ))}

      <button
        type="button"
        onClick={add}
        className="btn-outline flex items-center gap-2 w-full justify-center !py-3.5 border-dashed border-2 hover:bg-slate-50 font-bold text-navy"
      >
        <Plus size={18} /> Add New {SECTION_TITLES[sectionKey] || "Item"}
      </button>

      <style>{`.input { border: 1px solid #e2e8ea; border-radius: 10px; padding: 0.6rem 0.8rem; width: 100%; font-size: 0.875rem; outline: none; background: white; transition: border-color 0.2s; } .input:focus { border-color: #087F78; }`}</style>
    </div>
  );
}
