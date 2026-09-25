import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Phone, MessageCircle, Search, ShieldCheck, Star, Sparkles } from "lucide-react";
import { useContent } from "../context/ContentContext";
import CardGridSection from "../components/CardGridSection";
import EditBadge from "../components/EditBadge";
import Stars from "../components/Stars";
import client from "../api/client";

export default function Home() {
  const { get } = useContent();
  const navigate = useNavigate();
  const settings = get("settings", {});
  const hero = get("hero", {});
  const services = get("services", { items: [] }).items || [];
  const destinations = get("destinations", { items: [] }).items || [];
  const whyUs = get("whyUs", { items: [] }).items || [];
  const packages = get("packages", { items: [] }).items || [];
  const faqs = get("faqs", { items: [] }).items || [];

  const [form, setForm] = useState({ from: "", to: "", travelDate: "", travellers: "", vehicleType: "" });

  const handleQuote = (e) => {
    e.preventDefault();
    navigate("/enquiry", { state: form });
  };

  return (
    <div>
      {/* HERO */}
      <section
        className="relative overflow-hidden text-white"
        style={{
          backgroundImage: `linear-gradient(180deg, rgba(8,43,58,0.72) 0%, rgba(8,43,58,0.88) 100%), url(${
            hero.backgroundImage || "/images/hero-himachal.jpg"
          })`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="relative container-app pt-20 pb-24 md:pt-28 md:pb-36">
          <EditBadge to="/admin/content/hero" label="Hero" />
          
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 px-4 py-1.5 rounded-full text-gold text-xs md:text-sm font-bold mb-4 tracking-wide shadow-sm">
            <Sparkles size={15} className="text-gold" /> {settings.tagline || "Explore • Travel • Create Memories"}
          </div>

          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-white max-w-4xl leading-[1.1] tracking-tight">
            {hero.headline || "Explore the Journey. Create the Memory."}
          </h1>
          <p className="text-white/90 text-lg md:text-xl mt-5 max-w-2xl font-normal leading-relaxed">
            {hero.subheading ||
              "Reliable taxi services, curated tours and personalised travel experiences across Himachal Pradesh and beyond."}
          </p>

          <div className="flex flex-wrap gap-4 mt-8">
            <Link to="/custom-trip" className="btn-accent shadow-lg shadow-orange/30 !px-7 !py-3.5 text-base">
              Plan Your Trip
            </Link>
            {settings.phone && (
              <a
                href={`tel:${settings.phone.replace(/\s/g, "")}`}
                className="btn-primary bg-white/15 hover:bg-white/25 border border-white/30 backdrop-blur-md flex items-center gap-2.5 !px-6 !py-3.5 text-base"
              >
                <Phone size={18} /> Call Now
              </a>
            )}
            {settings.whatsapp && (
              <a
                href={`https://wa.me/${settings.whatsapp}`}
                target="_blank"
                rel="noreferrer"
                className="btn-primary bg-forest hover:bg-emerald-600 flex items-center gap-2.5 shadow-lg shadow-emerald-900/20 !px-6 !py-3.5 text-base"
              >
                <MessageCircle size={18} /> WhatsApp Us
              </a>
            )}
          </div>

          {/* Quote widget */}
          <form
            onSubmit={handleQuote}
            className="mt-12 bg-white/95 backdrop-blur-lg rounded-2xl p-5 md:p-6 shadow-2xl border border-white/40 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-6 gap-3.5 max-w-5xl text-navy"
          >
            <div>
              <label className="block text-[11px] font-bold text-navy/70 uppercase tracking-wider mb-1">Pickup City</label>
              <input
                className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm font-medium focus:border-teal focus:ring-1 focus:ring-teal outline-none bg-slate-50/50"
                placeholder="e.g. Chandigarh / Delhi / Una"
                value={form.from}
                onChange={(e) => setForm({ ...form, from: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-navy/70 uppercase tracking-wider mb-1">Destination</label>
              <input
                className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm font-medium focus:border-teal focus:ring-1 focus:ring-teal outline-none bg-slate-50/50"
                placeholder="e.g. Manali / Shimla / Spiti"
                value={form.to}
                onChange={(e) => setForm({ ...form, to: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-navy/70 uppercase tracking-wider mb-1">Travel Date</label>
              <input
                type="date"
                className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm font-medium focus:border-teal focus:ring-1 focus:ring-teal outline-none bg-slate-50/50"
                value={form.travelDate}
                onChange={(e) => setForm({ ...form, travelDate: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-navy/70 uppercase tracking-wider mb-1">Travellers</label>
              <input
                type="number"
                min="1"
                className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm font-medium focus:border-teal focus:ring-1 focus:ring-teal outline-none bg-slate-50/50"
                placeholder="Number of Guests"
                value={form.travellers}
                onChange={(e) => setForm({ ...form, travellers: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-navy/70 uppercase tracking-wider mb-1">Preferred Fleet</label>
              <select
                className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm font-medium focus:border-teal focus:ring-1 focus:ring-teal outline-none bg-slate-50/50"
                value={form.vehicleType}
                onChange={(e) => setForm({ ...form, vehicleType: e.target.value })}
              >
                <option value="">Any Vehicle</option>
                <option>Sedan (Maruti Dzire / Toyota Etios)</option>
                <option>SUV (Toyota Innova Crysta / Fortuner)</option>
                <option>4x4 Mountain (Mahindra Scorpio / Thar)</option>
                <option>Tempo Traveller (Force 12 / 17 / 26 Seat)</option>
                <option>Luxury VIP (Audi / BMW / Fortuner Legender)</option>
                <option>Minibus Coach (27 to 35 Seater)</option>
              </select>
            </div>
            <div className="flex flex-col justify-end">
              <button
                type="submit"
                className="btn-accent w-full h-[42px] flex items-center justify-center gap-2 text-sm font-bold shadow-md shadow-orange/20"
              >
                <Search size={16} /> Get Quote
              </button>
            </div>
          </form>
          <p className="text-white/70 text-xs mt-3 flex items-center gap-1.5 font-medium">
            <ShieldCheck size={14} className="text-emerald-400" /> Instant confirmation & transparent pricing — no online advance required.
          </p>
        </div>
      </section>

      {/* Trust bar */}
      <section className="bg-white border-b border-slate-100 shadow-xs">
        <div className="container-app py-5 flex flex-wrap items-center justify-center gap-x-12 gap-y-3 text-navy text-sm font-semibold">
          <div className="flex items-center gap-2">
            <Star size={18} className="fill-gold text-gold" />
            <span><strong className="font-display font-bold text-base">{settings.rating || "5.0"}</strong> Google Rating</span>
          </div>
          <div className="flex items-center gap-2">
            <Sparkles size={18} className="text-orange" />
            <span><strong className="font-display font-bold text-base">{settings.reviewCount || "18"}+</strong> Verified Reviews</span>
          </div>
          <div className="flex items-center gap-2">
            <ShieldCheck size={18} className="text-forest" />
            <span>Safe & Sanitized Vehicles</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-teal" />
            <span>Experienced Hill Chauffeurs</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-orange" />
            <span>Personalized Custom Itineraries</span>
          </div>
        </div>
      </section>

      <CardGridSection
        eyebrow="What We Offer"
        title="Popular Services"
        subtitle="Doorstep airport pickups, comfortable city sedans, mountain-ready SUVs, and luxury coaches."
        editKey="services"
        items={services.slice(0, 8)}
        ctaLabel="Enquire"
        onCardClick={() => navigate("/enquiry")}
      />

      <div className="bg-slate-50/70 border-y border-slate-100">
        <CardGridSection
          eyebrow="Where To Go"
          title="Popular Destinations"
          subtitle="Explore the crown jewels of Himachal Pradesh. Select any destination to create a custom package."
          editKey="destinations"
          items={destinations}
          columns="md:grid-cols-3 lg:grid-cols-5"
          onCardClick={(item) => navigate("/enquiry", { state: { destination: item.title } })}
        />
      </div>

      <CardGridSection
        eyebrow="Our Promise"
        title="Why Travel With RANA?"
        subtitle="Trusted by thousands of travellers for smooth and safe journeys across the Himalayas."
        editKey="whyUs"
        items={whyUs}
        columns="md:grid-cols-2 lg:grid-cols-3"
      />

      {packages.length > 0 && (
        <div className="bg-slate-50/70 border-y border-slate-100">
          <CardGridSection
            eyebrow="Handpicked For You"
            title="Featured Tour Packages"
            subtitle="Curated multi-day holiday packages with verified hill drivers and scenic stays."
            editKey="packages"
            items={packages}
            columns="md:grid-cols-2 lg:grid-cols-3"
            onCardClick={() => navigate("/tour-packages")}
            ctaLabel="View Details"
          />
        </div>
      )}

      {/* CTA with scenic background image */}
      <section
        className="relative overflow-hidden text-white py-20"
        style={{
          backgroundImage:
            "linear-gradient(180deg, rgba(8,43,58,0.85) 0%, rgba(8,43,58,0.92) 100%), url(/images/cta-sunset.jpg)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="container-app text-center relative z-10">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 px-4 py-1.5 rounded-full text-gold text-xs md:text-sm font-bold mb-4">
            <Sparkles size={15} className="text-gold" /> Plan Your Himachal Adventure
          </div>
          <h2 className="font-display text-3xl md:text-5xl font-extrabold mb-4 tracking-tight">
            Your Journey Starts Here
          </h2>
          <p className="text-white/80 max-w-xl mx-auto mb-8 text-base md:text-lg">
            Tell us where you want to go — our team will get back to you with custom itinerary planning and an instant quote.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link to="/enquiry" className="btn-accent shadow-lg shadow-orange/30 !px-8 !py-3.5 text-base">
              Send an Enquiry
            </Link>
            {settings.whatsapp && (
              <a
                href={`https://wa.me/${settings.whatsapp}`}
                target="_blank"
                rel="noreferrer"
                className="btn-primary bg-forest hover:bg-emerald-600 flex items-center gap-2 !px-7 !py-3.5 text-base"
              >
                <MessageCircle size={18} /> Chat on WhatsApp
              </a>
            )}
          </div>
        </div>
      </section>

      {/* Reviews teaser */}
      <section className="container-app py-16 text-center relative">
        <EditBadge to="/admin/reviews" label="Reviews" />
        <p className="text-orange font-semibold text-sm mb-2">Google Reviews</p>
        <div className="flex items-center justify-center gap-2 mb-2">
          <span className="text-3xl font-display font-bold text-navy">{settings.rating || "5.0"}</span>
          <Stars rating={settings.rating || 5} size={22} />
        </div>
        <p className="text-navy/60 mb-8">{settings.reviewCount || "18"} Google Reviews</p>
        <Link to="/reviews" className="btn-outline">Read All Reviews</Link>
      </section>

      {faqs.length > 0 && (
        <div className="bg-white">
          <section className="container-app py-16 max-w-3xl mx-auto relative">
            <EditBadge to="/admin/content/faqs" label="FAQs" />
            <h2 className="font-display text-3xl font-bold text-navy text-center mb-8">Frequently Asked Questions</h2>
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
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
