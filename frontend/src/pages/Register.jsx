import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import client from "../api/client";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const { refresh } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await client.post("/auth/register", form);
      await refresh();
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-app py-20 max-w-md mx-auto">
      <h1 className="font-display text-3xl font-bold text-navy mb-6 text-center">Create an Account</h1>
      <form onSubmit={submit} className="card p-8 space-y-4">
        <input className="input" placeholder="Full Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
        <input className="input" type="email" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
        <input className="input" type="password" placeholder="Password (min. 8 characters)" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required minLength={8} />
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <button className="btn-accent w-full" disabled={loading}>{loading ? "Creating account..." : "Register"}</button>
        <p className="text-sm text-center text-navy/60">
          Already have an account? <Link to="/login" className="text-teal font-semibold">Sign In</Link>
        </p>
      </form>
      <style>{`.input { border: 1px solid #e2e8ea; border-radius: 10px; padding: 0.65rem 0.85rem; width: 100%; font-size: 0.9rem; }`}</style>
    </div>
  );
}
