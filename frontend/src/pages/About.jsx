import { useContent } from "../context/ContentContext";
import EditBadge from "../components/EditBadge";
import CardGridSection from "../components/CardGridSection";

export default function About() {
  const { get } = useContent();
  const about = get("about", {});
  const whyUs = get("whyUs", { items: [] }).items || [];
  const settings = get("settings", {});

  return (
    <div>
      <section
        className="relative overflow-hidden text-white py-20"
        style={{
          backgroundImage:
            "linear-gradient(180deg, rgba(8,43,58,0.78) 0%, rgba(8,43,58,0.88) 100%), url(/images/banners/about-banner.jpg)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="container-app">
          <p className="text-gold font-bold text-sm uppercase tracking-widest mb-2">Our Heritage & Mission</p>
          <h1 className="font-display text-4xl md:text-5xl font-extrabold mb-3">About {settings.name || "Rana Tour And Travels"}</h1>
          <p className="text-white/85 max-w-2xl text-lg font-normal leading-relaxed">{settings.category || "Premium Taxi Service & Curated Himachal Tours"}</p>
        </div>
      </section>

      <section className="container-app py-16 relative">
        <EditBadge to="/admin/content/about" label="About" />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-8">
            <div className="bg-white p-6 md:p-8 rounded-2xl border border-slate-100 shadow-sm">
              <span className="text-xs font-extrabold uppercase text-orange tracking-wider">Beginning</span>
              <h2 className="font-display text-2xl md:text-3xl font-bold text-navy mt-1 mb-3">Our Story</h2>
              <p className="text-navy/75 leading-relaxed text-base">{about.ourStory}</p>
            </div>

            <div className="bg-white p-6 md:p-8 rounded-2xl border border-slate-100 shadow-sm">
              <span className="text-xs font-extrabold uppercase text-teal tracking-wider">Core Philosophy</span>
              <h2 className="font-display text-2xl md:text-3xl font-bold text-navy mt-1 mb-3">Our Approach</h2>
              <p className="text-navy/75 leading-relaxed text-base">{about.ourApproach}</p>
            </div>

            <div className="bg-white p-6 md:p-8 rounded-2xl border border-slate-100 shadow-sm">
              <span className="text-xs font-extrabold uppercase text-gold tracking-wider">Commitment</span>
              <h2 className="font-display text-2xl md:text-3xl font-bold text-navy mt-1 mb-3">Why Customers Choose Us</h2>
              <p className="text-navy/75 leading-relaxed text-base">{about.whyChooseUs}</p>
            </div>
          </div>

          <div className="lg:col-span-5 space-y-6">
            <div className="rounded-2xl overflow-hidden shadow-xl border border-slate-100 aspect-4/3 relative group">
              <img
                src="/images/services/suv-taxi.jpg"
                alt="Rana Tour And Travels Fleet"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-navy/80 via-transparent to-transparent flex items-end p-6">
                <div>
                  <p className="text-gold font-bold text-sm">Comfort & Safety First</p>
                  <p className="text-white font-display font-semibold text-lg">Well-Maintained Mountain Fleet</p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl overflow-hidden shadow-xl border border-slate-100 aspect-4/3 relative group">
              <img
                src="/images/destinations/dalhousie.jpg"
                alt="Himachal Landscapes"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-navy/80 via-transparent to-transparent flex items-end p-6">
                <div>
                  <p className="text-orange font-bold text-sm">Local Experts</p>
                  <p className="text-white font-display font-semibold text-lg">Unmatched Knowledge of Hill Routes</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="bg-white">
        <CardGridSection
          eyebrow="Our Values"
          title="Our Service Philosophy"
          editKey="whyUs"
          items={whyUs}
          columns="md:grid-cols-2 lg:grid-cols-3"
        />
      </div>
    </div>
  );
}
