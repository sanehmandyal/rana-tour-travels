import { useAuth } from "../context/AuthContext";

export default function Dashboard() {
  const { user, logout } = useAuth();

  return (
    <div className="container-app py-16 max-w-2xl mx-auto">
      <h1 className="font-display text-3xl font-bold text-navy mb-2">Welcome, {user?.name}</h1>
      <p className="text-navy/60 mb-8">{user?.email}</p>
      <div className="card p-6">
        <h2 className="font-semibold text-navy mb-2">My Enquiries</h2>
        <p className="text-navy/60 text-sm">
          To check the status of an enquiry, please call or WhatsApp us with your enquiry ID (e.g. RTT-2026-1234).
          Our team can look it up and update you directly.
        </p>
      </div>
      <button onClick={logout} className="btn-outline mt-6">Log Out</button>
    </div>
  );
}
