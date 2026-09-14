import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Search, Compass, Phone, MessageCircle, AlertCircle, ArrowRight } from "lucide-react";
import client from "../api/client";
import StatusBadge from "../components/StatusBadge";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [enquiryId, setEnquiryId] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleTrack = async (e) => {
    e.preventDefault();
    if (!enquiryId.trim()) return;
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const { data } = await client.get(`/enquiries/track/${enquiryId.trim()}`);
      setResult(data.enquiry);
    } catch (err) {
      setError(err.response?.data?.message || "Could not find enquiry with this ID.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-app py-14 max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-slate-200">
        <div>
          <h1 className="font-display text-3xl font-bold text-navy">Customer Portal</h1>
          <p className="text-navy/60 text-sm mt-1">Logged in as {user?.email || "Guest"}</p>
        </div>
        <button onClick={logout} className="btn-outline !py-2 !px-4 text-xs font-semibold self-start sm:self-auto">
          Log Out
        </button>
      </div>

      {/* Track Enquiry Card */}
      <div className="card p-6 mb-8 border border-slate-200 shadow-sm">
        <div className="flex items-center gap-2 mb-2">
          <Compass className="text-orange" size={20} />
          <h2 className="font-display text-xl font-bold text-navy">Track Your Booking / Enquiry Status</h2>
        </div>
        <p className="text-navy/60 text-sm mb-5">
          Enter your Enquiry ID (e.g. <span className="font-mono text-navy font-semibold">RTT-2026-XXXX</span>) from your confirmation screen or message to view live updates:
        </p>

        <form onSubmit={handleTrack} className="flex gap-3 mb-4">
          <div className="relative flex-1">
            <Search size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-navy/40" />
            <input
              type="text"
              required
              placeholder="e.g. RTT-2026-1234"
              value={enquiryId}
              onChange={(e) => setEnquiryId(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-sm font-mono focus:border-orange focus:ring-1 focus:ring-orange outline-none"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="btn-accent flex items-center gap-2 !py-2.5 !px-5 text-sm font-semibold"
          >
            {loading ? "Searching..." : "Track Status"}
          </button>
        </form>

        {error && (
          <div className="p-3 bg-red-50 text-red-700 border border-red-200 rounded-xl text-xs flex items-center gap-2 animate-fadeIn">
            <AlertCircle size={16} className="shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Live Enquiry Result */}
        {result && (
          <div className="mt-5 p-5 bg-slate-50 rounded-2xl border border-slate-200 animate-fadeIn space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-200">
              <div>
                <p className="text-xs text-navy/50 font-mono">ENQUIRY ID</p>
                <p className="font-mono font-bold text-navy text-lg">{result.enquiryId}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-navy/50 mb-1">CURRENT STATUS</p>
                <StatusBadge status={result.status} />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-3 text-sm">
              <div className="bg-white p-3 rounded-xl border border-slate-100">
                <p className="text-xs text-navy/50">Traveler Name</p>
                <p className="font-semibold text-navy">{result.fullName}</p>
              </div>
              <div className="bg-white p-3 rounded-xl border border-slate-100">
                <p className="text-xs text-navy/50">Trip Type</p>
                <p className="font-semibold text-navy">{result.tripType}</p>
              </div>
              <div className="bg-white p-3 rounded-xl border border-slate-100">
                <p className="text-xs text-navy/50">Pickup Location</p>
                <p className="font-semibold text-navy">{result.pickupLocation}</p>
              </div>
              <div className="bg-white p-3 rounded-xl border border-slate-100">
                <p className="text-xs text-navy/50">Drop Location</p>
                <p className="font-semibold text-navy">{result.dropLocation || "—"}</p>
              </div>
            </div>

            {result.quote?.amount && (
              <div className="bg-emerald-50 p-3.5 rounded-xl border border-emerald-200 flex items-center justify-between">
                <div>
                  <p className="text-xs text-emerald-800 font-bold uppercase tracking-wider">Finalized Quote</p>
                  <p className="text-sm text-emerald-900">{result.quote.notes || "Trip pricing confirmed"}</p>
                </div>
                <p className="text-xl font-bold font-display text-emerald-700">₹{result.quote.amount}</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Need Help Card */}
      <div className="card p-6 bg-evening text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 className="font-display font-bold text-lg">Need Immediate Assistance?</h3>
          <p className="text-xs text-white/70 mt-1">Our dispatch team is available 24/7 for booking confirmations.</p>
        </div>
        <div className="flex gap-2">
          <Link to="/contact" className="btn-accent !py-2 !px-4 text-xs flex items-center gap-1">
            Contact Us <ArrowRight size={13} />
          </Link>
        </div>
      </div>
    </div>
  );
}
