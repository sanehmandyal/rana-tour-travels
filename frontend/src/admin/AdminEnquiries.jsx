import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Search, Trash2, Eye } from "lucide-react";
import client from "../api/client";
import StatusBadge from "../components/StatusBadge";

const STATUSES = ["New", "Contacted", "Quote Sent", "Awaiting Confirmation", "Confirmed", "In Progress", "Completed", "Cancelled"];

export default function AdminEnquiries() {
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [actionMsg, setActionMsg] = useState("");

  const load = () => {
    setLoading(true);
    client
      .get("/enquiries", { params: { search, status, page } })
      .then(({ data }) => {
        setItems(data.items);
        setPages(data.pages);
      })
      .finally(() => setLoading(false));
  };

  const deleteEnquiry = async (id, enquiryId, e) => {
    e.stopPropagation();
    if (!window.confirm(`Are you sure you want to permanently delete enquiry ${enquiryId}?`)) {
      return;
    }
    try {
      await client.delete(`/enquiries/${id}`);
      setItems((prev) => prev.filter((item) => item._id !== id));
      setActionMsg(`Enquiry ${enquiryId} was deleted.`);
      setTimeout(() => setActionMsg(""), 3000);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete enquiry.");
    }
  };

  useEffect(() => { load(); }, [page, status]);

  const onSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    load();
  };

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-navy mb-6">Enquiries</h1>

      <form onSubmit={onSearchSubmit} className="flex flex-wrap gap-3 mb-5">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-navy/40" />
          <input
            className="input pl-9"
            placeholder="Search by name, phone or enquiry ID"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <select className="input max-w-[200px]" value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }}>
          <option value="">All Statuses</option>
          {STATUSES.map((s) => <option key={s}>{s}</option>)}
        </select>
        <button className="btn-primary !py-2 !px-5">Search</button>
      </form>

      {/* Quick Status Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 mb-4 text-xs font-semibold">
        <span className="text-navy/50 mr-1">Quick Filters:</span>
        {[
          { label: "All", val: "" },
          { label: "New", val: "New", badge: "bg-amber-100 text-amber-800" },
          { label: "Confirmed", val: "Confirmed", badge: "bg-teal-100 text-teal-800" },
          { label: "Completed", val: "Completed", badge: "bg-emerald-100 text-emerald-800 font-bold" },
          { label: "Cancelled", val: "Cancelled", badge: "bg-rose-100 text-rose-800" },
        ].map((tab) => (
          <button
            key={tab.label}
            onClick={() => { setStatus(tab.val); setPage(1); }}
            className={`px-3 py-1 rounded-full transition border ${
              status === tab.val
                ? "bg-navy text-white border-navy shadow-xs"
                : "bg-white text-navy/70 border-slate-200 hover:bg-slate-50"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {actionMsg && (
        <div className="p-3 mb-4 bg-rose-50 text-rose-800 border border-rose-200 rounded-xl text-xs font-semibold flex items-center justify-between animate-fadeIn">
          <span>{actionMsg}</span>
          <button onClick={() => setActionMsg("")} className="text-rose-500 hover:text-rose-700 font-bold px-2">✕</button>
        </div>
      )}

      <div className="card overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-navy/50 border-b bg-slate-50">
              <th className="py-3 px-4">Enquiry ID</th>
              <th className="py-3 px-4">Name</th>
              <th className="py-3 px-4">Phone</th>
              <th className="py-3 px-4">Trip Type</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">Date</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((e) => (
              <tr key={e._id} className="border-b last:border-0 hover:bg-slate-50/60">
                <td className="py-3 px-4">
                  <Link to={`/admin/enquiries/${e._id}`} className="font-mono text-xs text-teal font-semibold hover:underline">
                    {e.enquiryId}
                  </Link>
                </td>
                <td className="py-3 px-4 font-medium text-navy">{e.fullName}</td>
                <td className="py-3 px-4 text-navy/75">{e.phone}</td>
                <td className="py-3 px-4 text-navy/75">{e.tripType}</td>
                <td className="py-3 px-4">
                  <StatusBadge status={e.status} />
                </td>
                <td className="py-3 px-4 text-navy/50 text-xs">
                  {new Date(e.createdAt).toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" })}
                </td>
                <td className="py-3 px-4 text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    <Link
                      to={`/admin/enquiries/${e._id}`}
                      className="p-1.5 rounded-lg text-navy/70 hover:text-teal hover:bg-teal/10 transition"
                      title="View Details"
                    >
                      <Eye size={16} />
                    </Link>
                    <button
                      onClick={(ev) => deleteEnquiry(e._id, e.enquiryId, ev)}
                      className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 transition"
                      title="Delete Enquiry"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {!loading && items.length === 0 && (
              <tr><td colSpan={7} className="py-10 text-center text-navy/40">No enquiries found.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {pages > 1 && (
        <div className="flex justify-center gap-2 mt-5">
          {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
            <button key={p} onClick={() => setPage(p)} className={`h-8 w-8 rounded-full text-sm font-semibold ${p === page ? "bg-navy text-white" : "bg-white text-navy/60"}`}>
              {p}
            </button>
          ))}
        </div>
      )}
      <style>{`.input { border: 1px solid #e2e8ea; border-radius: 10px; padding: 0.6rem 0.8rem; font-size: 0.9rem; }`}</style>
    </div>
  );
}
