import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Inbox, Clock, CheckCircle2, XCircle, Sparkles } from "lucide-react";
import client from "../api/client";
import StatusBadge from "../components/StatusBadge";

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [recent, setRecent] = useState([]);

  useEffect(() => {
    client.get("/enquiries/stats/summary").then(({ data }) => setStats(data));
    client.get("/enquiries?limit=5").then(({ data }) => setRecent(data.items));
  }, []);

  const cards = [
    { label: "Total Enquiries", value: stats?.total ?? "-", icon: Inbox, color: "text-teal" },
    { label: "New", value: stats?.counts?.["New"] ?? "-", icon: Clock, color: "text-amber-600" },
    { label: "Confirmed", value: stats?.counts?.["Confirmed"] ?? "-", icon: Sparkles, color: "text-blue-600" },
    { label: "Completed", value: stats?.counts?.["Completed"] ?? "-", icon: CheckCircle2, color: "text-emerald-600" },
    { label: "Cancelled", value: stats?.counts?.["Cancelled"] ?? "-", icon: XCircle, color: "text-rose-500" },
  ];

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-navy mb-6">Dashboard</h1>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3.5 mb-8">
        {cards.map((c) => (
          <div key={c.label} className="card p-4 flex flex-col justify-between hover:shadow-md transition">
            <div className="flex items-center justify-between">
              <c.icon className={c.color} size={22} />
              {c.label === "Completed" && (
                <span className="text-[10px] font-bold uppercase bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">Done</span>
              )}
            </div>
            <div className="mt-3">
              <p className="text-2xl font-display font-bold text-navy">{c.value}</p>
              <p className="text-xs text-navy/60 font-medium mt-0.5">{c.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="card p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-navy">Recent Enquiries</h2>
          <Link to="/admin/enquiries" className="text-sm text-teal font-semibold hover:underline">View all →</Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-navy/50 border-b">
                <th className="py-2 pr-4">ID</th>
                <th className="py-2 pr-4">Name</th>
                <th className="py-2 pr-4">Phone</th>
                <th className="py-2 pr-4">Status</th>
              </tr>
            </thead>
            <tbody>
              {recent.map((e) => (
                <tr key={e._id} className="border-b last:border-0 hover:bg-slate-50/60">
                  <td className="py-2.5 pr-4">
                    <Link to={`/admin/enquiries/${e._id}`} className="font-mono text-xs text-teal font-semibold hover:underline">
                      {e.enquiryId}
                    </Link>
                  </td>
                  <td className="py-2.5 pr-4 font-medium text-navy">{e.fullName}</td>
                  <td className="py-2.5 pr-4 text-navy/70">{e.phone}</td>
                  <td className="py-2.5 pr-4">
                    <StatusBadge status={e.status} />
                  </td>
                </tr>
              ))}
              {recent.length === 0 && (
                <tr><td colSpan={4} className="py-6 text-center text-navy/40">No enquiries yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
