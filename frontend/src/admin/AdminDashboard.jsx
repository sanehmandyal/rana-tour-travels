import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Inbox, Clock, CheckCircle2, XCircle } from "lucide-react";
import client from "../api/client";

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [recent, setRecent] = useState([]);

  useEffect(() => {
    client.get("/enquiries/stats/summary").then(({ data }) => setStats(data));
    client.get("/enquiries?limit=5").then(({ data }) => setRecent(data.items));
  }, []);

  const cards = [
    { label: "Total Enquiries", value: stats?.total ?? "-", icon: Inbox, color: "text-teal" },
    { label: "New", value: stats?.counts?.["New"] ?? "-", icon: Clock, color: "text-orange" },
    { label: "Confirmed", value: stats?.counts?.["Confirmed"] ?? "-", icon: CheckCircle2, color: "text-forest" },
    { label: "Cancelled", value: stats?.counts?.["Cancelled"] ?? "-", icon: XCircle, color: "text-red-500" },
  ];

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-navy mb-6">Dashboard</h1>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {cards.map((c) => (
          <div key={c.label} className="card p-5">
            <c.icon className={c.color} size={22} />
            <p className="text-2xl font-display font-bold text-navy mt-2">{c.value}</p>
            <p className="text-xs text-navy/50">{c.label}</p>
          </div>
        ))}
      </div>

      <div className="card p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-navy">Recent Enquiries</h2>
          <Link to="/admin/enquiries" className="text-sm text-teal font-semibold">View all →</Link>
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
                <tr key={e._id} className="border-b last:border-0">
                  <td className="py-2 pr-4 font-mono text-xs">{e.enquiryId}</td>
                  <td className="py-2 pr-4">{e.fullName}</td>
                  <td className="py-2 pr-4">{e.phone}</td>
                  <td className="py-2 pr-4">
                    <span className="bg-sky text-teal px-2 py-0.5 rounded-full text-xs font-semibold">{e.status}</span>
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
