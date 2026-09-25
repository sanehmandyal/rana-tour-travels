import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
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
      navigate(user.role === "admin" ? "/admin" : "/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-app py-20 max-w-md mx-auto">
      <h1 className="font-display text-3xl font-bold text-navy mb-6 text-center">Sign In</h1>
      <form onSubmit={submit} className="card p-8 space-y-4" autoComplete="off">
        {/* Decoy fields to intercept aggressive browser credential autofill */}
        <input type="text" name="prevent_autofill_usr" style={{ display: "none" }} tabIndex={-1} aria-hidden="true" autoComplete="off" />
        <input type="password" name="prevent_autofill_pwd" style={{ display: "none" }} tabIndex={-1} aria-hidden="true" autoComplete="new-password" />

        <input
          className="input"
          type="email"
          name="user_login_email"
          placeholder="Email"
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
          name="user_login_secret"
          placeholder="Password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          required
          autoComplete="new-password"
        />
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <button className="btn-accent w-full" disabled={loading}>{loading ? "Signing in..." : "Sign In"}</button>
        <p className="text-sm text-center text-navy/60">
          No account? <Link to="/register" className="text-teal font-semibold">Register</Link>
        </p>
      </form>
      <style>{`.input { border: 1px solid #e2e8ea; border-radius: 10px; padding: 0.65rem 0.85rem; width: 100%; font-size: 0.9rem; }`}</style>
    </div>
  );
}
