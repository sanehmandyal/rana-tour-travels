import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Save, CheckCircle2 } from "lucide-react";
import client from "../api/client";
import StatusBadge from "../components/StatusBadge";

const STATUSES = ["New", "Contacted", "Quote Sent", "Awaiting Confirmation", "Confirmed", "In Progress", "Completed", "Cancelled"];

export default function AdminEnquiryDetail() {
  const { id } = useParams();
  const [enquiry, setEnquiry] = useState(null);
  const [notes, setNotes] = useState("");
  const [quoteAmount, setQuoteAmount] = useState("");
  const [quoteNotes, setQuoteNotes] = useState("");
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");
  const [statusMsg, setStatusMsg] = useState("");

  const load = () => {
    client.get(`/enquiries/${id}`).then(({ data }) => {
      setEnquiry(data.enquiry);
      setNotes(data.enquiry.internalNotes || "");
      setQuoteAmount(data.enquiry.quote?.amount || "");
      setQuoteNotes(data.enquiry.quote?.notes || "");
    });
  };

  useEffect(() => { load(); }, [id]);

  const updateStatus = async (status) => {
    try {
      await client.patch(`/enquiries/${id}`, { status });
      setStatusMsg(`Status successfully updated to "${status}"!`);
      load();
      setTimeout(() => setStatusMsg(""), 3500);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update status");
    }
  };

  const saveNotesAndQuote = async () => {
    setSaving(true);
    try {
      await client.patch(`/enquiries/${id}`, {
        internalNotes: notes,
        quote: { amount: Number(quoteAmount) || undefined, notes: quoteNotes, sentAt: quoteAmount ? new Date() : undefined },
      });
      setMsg("Saved.");
      load();
    } finally {
      setSaving(false);
      setTimeout(() => setMsg(""), 2500);
    }
  };

  if (!enquiry) return <div className="text-navy/50 py-10">Loading...</div>;

  return (
    <div className="max-w-3xl">
      <Link to="/admin/enquiries" className="flex items-center gap-1 text-navy/60 text-sm mb-4 hover:underline">
        <ArrowLeft size={14} /> Back to Enquiries
      </Link>

      <div className="card p-5 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-slate-200">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="font-display text-2xl font-bold text-navy">{enquiry.enquiryId}</h1>
            <StatusBadge status={enquiry.status} />
          </div>
          <p className="text-xs text-navy/50">Submitted on {new Date(enquiry.createdAt).toLocaleString("en-IN")}</p>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-xs font-bold text-navy/60 uppercase tracking-wider">Change Status:</label>
          <select
            value={enquiry.status}
            onChange={(e) => updateStatus(e.target.value)}
            className="input !py-1.5 !px-3 font-semibold text-sm bg-white border-slate-300"
          >
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      </div>

      {statusMsg && (
        <div className="p-3 mb-6 bg-emerald-50 text-emerald-800 border border-emerald-300 rounded-xl text-xs font-semibold flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
          <span>{statusMsg}</span>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-4 mb-6">
        <Info label="Full Name" value={enquiry.fullName} />
        <Info label="Phone" value={enquiry.phone} />
        <Info label="Email" value={enquiry.email || "—"} />
        <Info label="Trip Type" value={enquiry.tripType} />
        <Info label="Pickup" value={enquiry.pickupLocation} />
        <Info label="Drop" value={enquiry.dropLocation || "—"} />
        <Info label="Travel Date" value={enquiry.travelDate ? new Date(enquiry.travelDate).toLocaleDateString() : "—"} />
        <Info label="Travellers" value={enquiry.travellers} />
        <Info label="Vehicle Type" value={enquiry.vehicleType || "—"} />
      </div>

      {enquiry.additionalRequirements && (
        <div className="card p-4 mb-6">
          <p className="text-xs font-semibold text-navy/50 mb-1">Additional Requirements</p>
          <p className="text-sm text-navy/80">{enquiry.additionalRequirements}</p>
        </div>
      )}

      <div className="card p-5 space-y-4">
        <h2 className="font-semibold text-navy">Internal Notes & Quote</h2>
        <textarea rows={3} className="input" placeholder="Internal notes (not visible to customer)" value={notes} onChange={(e) => setNotes(e.target.value)} />
        <div className="grid md:grid-cols-2 gap-4">
          <input className="input" type="number" placeholder="Quote amount (₹)" value={quoteAmount} onChange={(e) => setQuoteAmount(e.target.value)} />
          <input className="input" placeholder="Quote notes" value={quoteNotes} onChange={(e) => setQuoteNotes(e.target.value)} />
        </div>
        {msg && <p className="text-forest text-sm font-semibold">{msg}</p>}
        <button onClick={saveNotesAndQuote} disabled={saving} className="btn-primary flex items-center gap-2 !py-2 !px-4">
          <Save size={16} /> {saving ? "Saving..." : "Save"}
        </button>
      </div>
      <style>{`.input { border: 1px solid #e2e8ea; border-radius: 10px; padding: 0.6rem 0.8rem; width: 100%; font-size: 0.9rem; }`}</style>
    </div>
  );
}

function Info({ label, value }) {
  return (
    <div className="card p-3">
      <p className="text-xs text-navy/45">{label}</p>
      <p className="text-sm font-semibold text-navy">{value}</p>
    </div>
  );
}
