import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Lock } from "lucide-react";
import { useAuth } from "../context/AuthContext";

import BrandLogo from "../components/BrandLogo";

export default function AdminLogin() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const user = await login(form.email, form.password);
      if (user.role !== "admin") {
        setError("This account does not have admin access.");
        return;
      }
      navigate("/admin");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-evening flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <Link to="/" className="flex items-center gap-2 text-white/70 hover:text-white text-sm mb-6">
          <ArrowLeft size={16} /> Back to site
        </Link>
        <div className="bg-white rounded-card p-8 shadow-2xl">
          <div className="flex flex-col items-center mb-6">
            <BrandLogo variant="light" size="lg" linkTo="" className="mb-4" />
            <h1 className="font-display text-xl font-bold text-navy">Admin Portal</h1>
            <p className="text-navy/50 text-xs mt-0.5">Authorized Team Sign In</p>
          </div>
          <form onSubmit={submit} className="space-y-4" autoComplete="off">
            {/* Decoy fields to intercept aggressive browser credential autofill */}
            <input type="text" name="prevent_autofill_usr" style={{ display: "none" }} tabIndex={-1} aria-hidden="true" autoComplete="off" />
            <input type="password" name="prevent_autofill_pwd" style={{ display: "none" }} tabIndex={-1} aria-hidden="true" autoComplete="new-password" />

            <input
              className="input"
              type="email"
              name="rtt_admin_user"
              placeholder="Admin email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck="false"
            />
            <input
              className="input"
              type="password"
              name="rtt_admin_secret"
              placeholder="Password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
              autoComplete="new-password"
            />
            {error && <p className="text-red-600 text-sm">{error}</p>}
            <button className="btn-primary w-full flex items-center justify-center gap-2 !py-2.5" disabled={loading}>
              <Lock size={16} /> {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-slate-100 text-center">
            <p className="text-xs text-navy/50">
              Restricted portal. Only the fixed authorized administrator can access this panel.
            </p>
          </div>
        </div>
      </div>
      <style>{`.input { border: 1px solid #e2e8ea; border-radius: 10px; padding: 0.65rem 0.85rem; width: 100%; font-size: 0.9rem; }`}</style>
    </div>
  );
}
