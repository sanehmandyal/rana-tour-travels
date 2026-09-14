import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function RequireAdmin({ children }) {
  const { user, loading, isAdmin } = useAuth();
  if (loading) return <div className="p-10 text-center text-navy/50">Loading...</div>;
  if (!user || !isAdmin) return <Navigate to="/admin/login" replace />;
  return children;
}
