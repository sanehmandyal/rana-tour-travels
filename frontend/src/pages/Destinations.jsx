import { useNavigate } from "react-router-dom";
import { useContent } from "../context/ContentContext";
import CardGridSection from "../components/CardGridSection";

export default function Destinations() {
  const { get } = useContent();
  const destinations = get("destinations", { items: [] }).items || [];
  const navigate = useNavigate();

  return (
    <div>
      <section
        className="relative overflow-hidden text-white py-20"
        style={{
          backgroundImage:
            "linear-gradient(180deg, rgba(8,43,58,0.78) 0%, rgba(8,43,58,0.88) 100%), url(/images/banners/destinations-banner.jpg)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="container-app">
          <p className="text-gold font-bold text-sm uppercase tracking-widest mb-2">Explore Himachal Pradesh</p>
          <h1 className="font-display text-4xl md:text-5xl font-extrabold mb-3">Popular Destinations</h1>
          <p className="text-white/85 max-w-2xl text-lg font-normal leading-relaxed">
            From the snow peaks of Manali to the high-altitude wonders of Spiti — choose your dream location and let us handle every detail.
          </p>
        </div>
      </section>

      <CardGridSection
        editKey="destinations"
        items={destinations}
        columns="md:grid-cols-3 lg:grid-cols-4"
        ctaLabel="Request This Trip"
        onCardClick={(item) => navigate("/enquiry", { state: { destination: item.title } })}
        emptyMessage="Destinations will appear here once added by the admin."
      />
    </div>
  );
}
