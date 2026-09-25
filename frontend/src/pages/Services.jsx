import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Car, Mountain, Landmark, Check } from "lucide-react";
import { useContent } from "../context/ContentContext";
import CardGridSection from "../components/CardGridSection";

export default function Services() {
  const { get } = useContent();
  const allServices = get("services", { items: [] }).items || [];
  const [activeTab, setActiveTab] = useState("all");
  const navigate = useNavigate();

  const filteredServices = allServices.filter((s) => {
    if (activeTab === "all") return true;
    if (activeTab === "cabs") {
      return (
        s.category === "cabs" ||
        s.title.toLowerCase().includes("taxi") ||
        s.title.toLowerCase().includes("cab") ||
        s.title.toLowerCase().includes("rental") ||
        s.title.toLowerCase().includes("traveller") ||
        s.title.toLowerCase().includes("minibus") ||
        s.title.toLowerCase().includes("luxury")
      );
    }
    if (activeTab === "himachal") {
      return (
        s.category === "himachal" ||
        s.title.toLowerCase().includes("himachal") ||
        s.title.toLowerCase().includes("manikaran") ||
        s.title.toLowerCase().includes("baijnath") ||
        s.title.toLowerCase().includes("sightseeing")
      );
    }
    if (activeTab === "temples") {
      return (
        s.category === "temples" ||
        s.title.toLowerCase().includes("golden temple") ||
        s.title.toLowerCase().includes("vaishno devi") ||
        s.title.toLowerCase().includes("haridwar") ||
        s.title.toLowerCase().includes("khatu") ||
        s.title.toLowerCase().includes("ayodhya")
      );
    }
    return true;
  });

  const counts = {
    all: allServices.length,
    cabs: allServices.filter((s) => s.category === "cabs" || s.title.toLowerCase().includes("taxi") || s.title.toLowerCase().includes("cab")).length,
    himachal: allServices.filter((s) => s.category === "himachal" || s.title.toLowerCase().includes("himachal") || s.title.toLowerCase().includes("manikaran") || s.title.toLowerCase().includes("baijnath")).length,
    temples: allServices.filter((s) => s.category === "temples" || s.title.toLowerCase().includes("golden temple") || s.title.toLowerCase().includes("vaishno devi") || s.title.toLowerCase().includes("haridwar") || s.title.toLowerCase().includes("khatu") || s.title.toLowerCase().includes("ayodhya")).length,
  };

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
          <p className="text-gold font-bold text-sm uppercase tracking-widest mb-2">Fleet, Pilgrimage & Travel Solutions</p>
          <h1 className="font-display text-4xl md:text-5xl font-extrabold mb-3">Our Services</h1>
          <p className="text-white/85 max-w-2xl text-lg font-normal leading-relaxed">
            Reliable mountain cabs, Force Tempo Travellers, sacred Himachal Shaktipeeth yatras, and outstation pilgrimage tours across North India.
          </p>

          {/* Interactive Service Category Filter Pills */}
          <div className="flex flex-wrap items-center gap-2.5 mt-8">
            <button
              onClick={() => setActiveTab("all")}
              className={`px-4 py-2 rounded-full text-xs md:text-sm font-semibold transition border backdrop-blur-md flex items-center gap-1.5 ${
                activeTab === "all"
                  ? "bg-gold text-navy border-gold shadow-md font-bold"
                  : "bg-white/10 hover:bg-white/20 text-white border-white/20"
              }`}
            >
              All Services ({counts.all})
            </button>
            <button
              onClick={() => setActiveTab("cabs")}
              className={`px-4 py-2 rounded-full text-xs md:text-sm font-semibold transition border backdrop-blur-md flex items-center gap-1.5 ${
                activeTab === "cabs"
                  ? "bg-gold text-navy border-gold shadow-md font-bold"
                  : "bg-white/10 hover:bg-white/20 text-white border-white/20"
              }`}
            >
              <Car size={15} /> Taxi & Cab Fleet ({counts.cabs})
            </button>
            <button
              onClick={() => setActiveTab("himachal")}
              className={`px-4 py-2 rounded-full text-xs md:text-sm font-semibold transition border backdrop-blur-md flex items-center gap-1.5 ${
                activeTab === "himachal"
                  ? "bg-gold text-navy border-gold shadow-md font-bold"
                  : "bg-white/10 hover:bg-white/20 text-white border-white/20"
              }`}
            >
              <Mountain size={15} /> Himachal Tours & Temples ({counts.himachal})
            </button>
            <button
              onClick={() => setActiveTab("temples")}
              className={`px-4 py-2 rounded-full text-xs md:text-sm font-semibold transition border backdrop-blur-md flex items-center gap-1.5 ${
                activeTab === "temples"
                  ? "bg-gold text-navy border-gold shadow-md font-bold"
                  : "bg-white/10 hover:bg-white/20 text-white border-white/20"
              }`}
            >
              <Landmark size={15} /> Temples Outside Himachal ({counts.temples})
            </button>
          </div>
        </div>
      </section>

      <CardGridSection
        editKey="services"
        items={filteredServices}
        columns="md:grid-cols-2 lg:grid-cols-3"
        ctaLabel="Enquire Now"
        onCardClick={(item) => navigate("/enquiry", { state: { service: item.title } })}
        emptyMessage="Services will appear here once added by the admin."
      />
    </div>
  );
}
