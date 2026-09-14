import { useEffect, useState } from "react";
import { Plus, Trash2, Eye, EyeOff, Save } from "lucide-react";
import client from "../api/client";

export default function AdminReviews() {
  const [reviews, setReviews] = useState([]);
  const [form, setForm] = useState({ author: "", rating: 5, text: "", source: "Google" });

  const load = () => client.get("/reviews/all").then(({ data }) => setReviews(data.reviews));
  useEffect(() => { load(); }, []);

  const add = async (e) => {
    e.preventDefault();
    if (!form.author || !form.text) return;
    await client.post("/reviews", form);
    setForm({ author: "", rating: 5, text: "", source: "Google" });
    load();
  };

  const toggleVisible = async (r) => {
    await client.patch(`/reviews/${r._id}`, { visible: !r.visible });
    load();
  };

  const remove = async (id) => {
    if (!confirm("Delete this review?")) return;
    await client.delete(`/reviews/${id}`);
    load();
  };

  return (
    <div className="max-w-3xl">
      <h1 className="font-display text-2xl font-bold text-navy mb-6">Reviews & Testimonials</h1>

      <form onSubmit={add} className="card p-5 mb-6 space-y-3">
        <h2 className="font-semibold text-navy text-sm mb-1">Add Review</h2>
        <div className="grid md:grid-cols-3 gap-3">
          <input className="input" placeholder="Author name" value={form.author} onChange={(e) => setForm({ ...form, author: e.target.value })} />
          <select className="input" value={form.rating} onChange={(e) => setForm({ ...form, rating: Number(e.target.value) })}>
            {[5, 4, 3, 2, 1].map((n) => <option key={n} value={n}>{n} stars</option>)}
          </select>
          <select className="input" value={form.source} onChange={(e) => setForm({ ...form, source: e.target.value })}>
            <option>Google</option>
            <option>Testimonial</option>
          </select>
        </div>
        <textarea className="input" rows={2} placeholder="Review text" value={form.text} onChange={(e) => setForm({ ...form, text: e.target.value })} />
        <button className="btn-primary flex items-center gap-2 !py-2 !px-4"><Plus size={16} /> Add Review</button>
      </form>

      <div className="space-y-3">
        {reviews.map((r) => (
          <div key={r._id} className="card p-4 flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-navy">{r.author} · {r.rating}★ · {r.source}</p>
              <p className="text-sm text-navy/70 mt-1">{r.text}</p>
            </div>
            <div className="flex gap-2 shrink-0">
              <button onClick={() => toggleVisible(r)} className="text-navy/50 hover:text-navy" title={r.visible ? "Hide" : "Show"}>
                {r.visible ? <Eye size={18} /> : <EyeOff size={18} />}
              </button>
              <button onClick={() => remove(r._id)} className="text-red-500 hover:text-red-700"><Trash2 size={18} /></button>
            </div>
          </div>
        ))}
        {reviews.length === 0 && <p className="text-navy/40 text-center py-8">No reviews yet.</p>}
      </div>
      <style>{`.input { border: 1px solid #e2e8ea; border-radius: 10px; padding: 0.6rem 0.8rem; width: 100%; font-size: 0.9rem; }`}</style>
    </div>
  );
}
