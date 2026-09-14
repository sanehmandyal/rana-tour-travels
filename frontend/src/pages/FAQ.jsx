import { useContent } from "../context/ContentContext";
import EditBadge from "../components/EditBadge";

export default function FAQ() {
  const { get } = useContent();
  const faqs = get("faqs", { items: [] }).items || [];

  return (
    <div>
      <section className="bg-evening text-white py-16">
        <div className="container-app">
          <h1 className="font-display text-4xl font-bold mb-3">Frequently Asked Questions</h1>
        </div>
      </section>

      <section className="container-app py-14 max-w-3xl mx-auto relative">
        <EditBadge to="/admin/content/faqs" label="FAQs" />
        <div className="space-y-3">
          {faqs.map((f, i) => (
            <details key={i} className="card p-5 group">
              <summary className="font-semibold text-navy cursor-pointer list-none flex justify-between items-center">
                {f.title}
                <span className="text-teal group-open:rotate-45 transition-transform text-xl">+</span>
              </summary>
              <p className="text-navy/70 mt-3 text-sm">{f.description}</p>
            </details>
          ))}
          {faqs.length === 0 && <p className="text-center text-navy/50 py-10">No FAQs added yet.</p>}
        </div>
      </section>
    </div>
  );
}
