import { useEffect, useState } from "react";
import { Star, PenLine, CheckCircle2, X, AlertCircle, Send, Sparkles } from "lucide-react";
import client from "../api/client";
import Stars from "../components/Stars";
import EditBadge from "../components/EditBadge";
import { useContent } from "../context/ContentContext";

export default function Reviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const [form, setForm] = useState({
    author: "",
    rating: 5,
    tripType: "",
    text: "",
  });
  const [hoverRating, setHoverRating] = useState(0);

  const { get } = useContent();
  const settings = get("settings", {});

  const fetchReviews = async () => {
    try {
      const { data } = await client.get("/reviews");
      setReviews(data.reviews || []);
    } catch (err) {
      console.error("Failed to load reviews:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (!form.author.trim()) {
      setErrorMsg("Please enter your name.");
      return;
    }
    if (!form.text.trim()) {
      setErrorMsg("Please write a few words about your journey.");
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        author: form.author.trim(),
        rating: Number(form.rating),
        tripType: form.tripType.trim() || undefined,
        text: form.text.trim(),
      };

      const { data } = await client.post("/reviews/public", payload);
      if (data.success) {
        setSuccessMsg("Thank you! Your review has been submitted and published.");
        setForm({ author: "", rating: 5, tripType: "", text: "" });
        // Refresh reviews list so new review appears immediately
        if (data.review) {
          setReviews((prev) => [data.review, ...prev]);
        } else {
          fetchReviews();
        }
        setTimeout(() => {
          setModalOpen(false);
          setSuccessMsg("");
        }, 2200);
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.message || "Failed to submit review. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const getRatingLabel = (val) => {
    switch (val) {
      case 5: return "⭐⭐⭐⭐⭐ Outstanding (5/5)";
      case 4: return "⭐⭐⭐⭐ Very Good (4/5)";
      case 3: return "⭐⭐⭐ Good (3/5)";
      case 2: return "⭐⭐ Average (2/5)";
      case 1: return "⭐ Poor (1/5)";
      default: return "";
    }
  };

  return (
    <div>
      {/* Hero Banner with Call to Action */}
      <section className="bg-gradient-to-r from-navy via-navy to-evening text-white py-16 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#d4af37_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />
        <div className="container-app relative flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold/20 text-gold text-xs font-semibold mb-3 border border-gold/30">
              <Sparkles size={14} /> Genuine Traveler Feedback
            </div>
            <h1 className="font-display text-4xl sm:text-5xl font-bold mb-3">Customer Reviews & Experiences</h1>
            <p className="text-white/70 max-w-xl text-sm sm:text-base mb-4">
              Real journeys, unforgettable memories, and honest feedback from travelers who explored the Himalayas with Rana Tour And Travels.
            </p>
            <div className="flex flex-wrap items-center gap-4 text-sm">
              <div className="flex items-center gap-2.5 bg-white/10 backdrop-blur-md px-3.5 py-1.5 rounded-lg border border-white/15">
                <span className="text-2xl font-display font-bold text-gold">{settings.rating || "5.0"}</span>
                <Stars rating={settings.rating || 5} size={20} />
              </div>
              <span className="text-white/80 font-medium">
                {reviews.length > 0 ? `${reviews.length}+ Verified Reviews` : `${settings.reviewCount || "18"} Google Reviews`}
              </span>
            </div>
          </div>

          <button
            onClick={() => {
              setModalOpen(true);
              setSuccessMsg("");
              setErrorMsg("");
            }}
            className="btn-accent flex items-center gap-2 shadow-lg hover:shadow-orange/30 !py-3.5 !px-6 text-base shrink-0"
          >
            <PenLine size={18} /> Write a Review
          </button>
        </div>
      </section>

      {/* Reviews Grid */}
      <section className="container-app py-14 relative">
        <EditBadge to="/admin/reviews" label="Manage Reviews" />

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 pb-4 border-b border-gray-100">
          <div>
            <h2 className="font-display text-2xl font-bold text-navy">What Our Guests Say</h2>
            <p className="text-sm text-navy/60">Every review helps us keep serving high standard Himalayan hospitality</p>
          </div>
          <button
            onClick={() => setModalOpen(true)}
            className="text-sm font-semibold text-orange hover:text-orange-dark flex items-center gap-1.5 transition"
          >
            <PenLine size={16} /> Leave Your Review
          </button>
        </div>

        {loading ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="card p-6 animate-pulse bg-gray-50 border border-gray-200">
                <div className="h-4 bg-gray-200 rounded w-28 mb-4" />
                <div className="h-16 bg-gray-200 rounded mb-4" />
                <div className="h-4 bg-gray-200 rounded w-32 mb-1" />
                <div className="h-3 bg-gray-200 rounded w-20" />
              </div>
            ))}
          </div>
        ) : reviews.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {reviews.map((r) => (
              <div
                key={r._id}
                className="card p-6 flex flex-col justify-between hover:shadow-lg transition-all duration-300 border border-gray-100/80 hover:border-gold/30 bg-white"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <Stars rating={r.rating} size={18} />
                    <span className="text-[11px] font-semibold tracking-wide uppercase px-2 py-0.5 rounded-full bg-navy/5 text-navy/70">
                      {r.source || "Customer"}
                    </span>
                  </div>
                  <p className="text-navy/80 text-sm leading-relaxed mb-4 italic">
                    "{r.text}"
                  </p>
                </div>
                <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                  <div>
                    <p className="font-bold text-navy text-sm">{r.author}</p>
                    <p className="text-xs text-navy/50">
                      {r.createdAt ? new Date(r.createdAt).toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" }) : "Verified Guest"}
                    </p>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-navy to-teal text-white flex items-center justify-center font-display font-bold text-xs">
                    {r.author?.charAt(0)?.toUpperCase() || "R"}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-sand/30 rounded-2xl border border-sand">
            <p className="text-navy/70 text-base mb-3">No reviews submitted yet.</p>
            <button onClick={() => setModalOpen(true)} className="btn-accent text-sm">
              Be the first to share your experience!
            </button>
          </div>
        )}
      </section>

      {/* Review Submission Modal Dialog */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy/60 backdrop-blur-xs animate-fadeIn">
          <div
            className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-gray-100 overflow-hidden relative"
            role="dialog"
            aria-modal="true"
          >
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-navy to-evening px-6 py-5 text-white flex items-center justify-between">
              <div>
                <h3 className="font-display text-xl font-bold">Write a Review</h3>
                <p className="text-xs text-white/70">Share your travel story with future travelers</p>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="text-white/70 hover:text-white p-1 rounded-lg hover:bg-white/10 transition"
                aria-label="Close dialog"
              >
                <X size={22} />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {errorMsg && (
                <div className="flex items-center gap-2 p-3 text-xs bg-red-50 text-red-700 border border-red-200 rounded-lg">
                  <AlertCircle size={16} className="shrink-0 text-red-500" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {successMsg && (
                <div className="flex items-center gap-2 p-3 text-xs bg-green-50 text-green-700 border border-green-200 rounded-lg">
                  <CheckCircle2 size={16} className="shrink-0 text-green-600" />
                  <span>{successMsg}</span>
                </div>
              )}

              {/* Star Rating Picker */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-navy mb-1.5">
                  Rating (1 to 5 Stars) *
                </label>
                <div className="flex items-center gap-1.5 py-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setForm({ ...form, rating: star })}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      className="p-1 hover:scale-115 transition-transform"
                      aria-label={`${star} star`}
                    >
                      <Star
                        size={28}
                        className={
                          (hoverRating || form.rating) >= star
                            ? "fill-gold text-gold transition-colors"
                            : "text-gray-300 transition-colors"
                        }
                      />
                    </button>
                  ))}
                  <span className="ml-2 text-xs font-semibold text-navy/70">
                    {getRatingLabel(hoverRating || form.rating)}
                  </span>
                </div>
              </div>

              {/* Author Name */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-navy mb-1">
                  Your Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rahul Sharma"
                  value={form.author}
                  onChange={(e) => setForm({ ...form, author: e.target.value })}
                  className="input text-sm"
                />
              </div>

              {/* Trip / Service Type */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-navy mb-1">
                  Trip or Destination (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Shimla Manali 5-Day Tour, Airport Taxi"
                  value={form.tripType}
                  onChange={(e) => setForm({ ...form, tripType: e.target.value })}
                  className="input text-sm"
                />
              </div>

              {/* Review Text */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-navy mb-1">
                  Your Review & Experience *
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="Tell us about the vehicle condition, driver punctuality, sightseeing experience, and hospitality..."
                  value={form.text}
                  onChange={(e) => setForm({ ...form, text: e.target.value })}
                  className="input text-sm resize-none"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="btn-outline !py-2.5 !px-4 text-sm"
                  disabled={submitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-accent flex items-center gap-2 !py-2.5 !px-5 text-sm"
                >
                  {submitting ? (
                    <>Submitting...</>
                  ) : (
                    <>
                      <Send size={15} /> Submit Review
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
