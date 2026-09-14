import { useNavigate } from "react-router-dom";
import { useContent } from "../context/ContentContext";
import CardGridSection from "../components/CardGridSection";

export default function Services() {
  const { get } = useContent();
  const services = get("services", { items: [] }).items || [];
  const navigate = useNavigate();

  return (
    <div>
      <section
        className="relative overflow-hidden text-white py-20"
        style={{
          backgroundImage:
            "linear-gradient(180deg, rgba(8,43,58,0.78) 0%, rgba(8,43,58,0.88) 100%), url(/images/banners/services-banner.jpg)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="container-app">
          <p className="text-gold font-bold text-sm uppercase tracking-widest mb-2">Fleet & Travel Solutions</p>
          <h1 className="font-display text-4xl md:text-5xl font-extrabold mb-3">Our Services</h1>
          <p className="text-white/85 max-w-2xl text-lg font-normal leading-relaxed">
            From seamless airport transfers to multi-day hill expeditions — experience unmatched reliability, spotless vehicles, and professional chauffeurs.
          </p>
        </div>
      </section>

      <CardGridSection
        editKey="services"
        items={services}
        columns="md:grid-cols-2 lg:grid-cols-3"
        ctaLabel="Enquire Now"
        onCardClick={(item) => navigate("/enquiry", { state: { service: item.title } })}
        emptyMessage="Services will appear here once added by the admin."
      />
    </div>
  );
}
