import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Search } from "lucide-react";
import client from "../api/client";

const STATUSES = ["New", "Contacted", "Quote Sent", "Awaiting Confirmation", "Confirmed", "In Progress", "Completed", "Cancelled"];

export default function AdminEnquiries() {
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);

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

      <div className="card overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-navy/50 border-b bg-sky/50">
              <th className="py-3 px-4">Enquiry ID</th>
              <th className="py-3 px-4">Name</th>
              <th className="py-3 px-4">Phone</th>
              <th className="py-3 px-4">Trip Type</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">Date</th>
            </tr>
          </thead>
          <tbody>
            {items.map((e) => (
              <tr key={e._id} className="border-b last:border-0 hover:bg-sky/30">
                <td className="py-3 px-4">
                  <Link to={`/admin/enquiries/${e._id}`} className="font-mono text-xs text-teal font-semibold">{e.enquiryId}</Link>
                </td>
                <td className="py-3 px-4">{e.fullName}</td>
                <td className="py-3 px-4">{e.phone}</td>
                <td className="py-3 px-4">{e.tripType}</td>
                <td className="py-3 px-4"><span className="bg-sky text-teal px-2 py-0.5 rounded-full text-xs font-semibold">{e.status}</span></td>
                <td className="py-3 px-4 text-navy/50">{new Date(e.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
            {!loading && items.length === 0 && (
              <tr><td colSpan={6} className="py-10 text-center text-navy/40">No enquiries found.</td></tr>
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
