import { useNavigate } from "react-router-dom";
import { useContent } from "../context/ContentContext";
import CardGridSection from "../components/CardGridSection";

export default function TourPackages() {
  const { get } = useContent();
  const packages = get("packages", { items: [] }).items || [];
  const navigate = useNavigate();

  return (
    <div>
      <section
        className="relative overflow-hidden text-white py-20"
        style={{
          backgroundImage:
            "linear-gradient(180deg, rgba(8,43,58,0.78) 0%, rgba(8,43,58,0.88) 100%), url(/images/banners/packages-banner.jpg)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="container-app">
          <p className="text-gold font-bold text-sm uppercase tracking-widest mb-2">Curated Himalayan Itineraries</p>
          <h1 className="font-display text-4xl md:text-5xl font-extrabold mb-3">Tour Packages</h1>
          <p className="text-white/85 max-w-2xl text-lg font-normal leading-relaxed">
            Carefully planned multi-day tours designed for families, honeymooners, and adventure seekers across Himachal Pradesh.
          </p>
        </div>
      </section>

      <CardGridSection
        editKey="packages"
        items={packages}
        columns="md:grid-cols-2 lg:grid-cols-3"
        ctaLabel="Enquire Now"
        onCardClick={(item) => navigate("/enquiry", { state: { package: item.title } })}
        emptyMessage="Tour packages will appear here once added by the admin."
      />
    </div>
  );
}
