import { Phone, MessageCircle, MapPin, Navigation } from "lucide-react";
import { Link } from "react-router-dom";
import { useContent } from "../context/ContentContext";
import EditBadge from "../components/EditBadge";

export default function Contact() {
  const { get } = useContent();
  const settings = get("settings", {});

  return (
    <div>
      <section
        className="relative overflow-hidden text-white py-20"
        style={{
          backgroundImage:
            "linear-gradient(180deg, rgba(8,43,58,0.78) 0%, rgba(8,43,58,0.88) 100%), url(/images/banners/contact-banner.jpg)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="container-app">
          <p className="text-gold font-bold text-sm uppercase tracking-widest mb-2">Get in Touch</p>
          <h1 className="font-display text-4xl md:text-5xl font-extrabold mb-3">Contact Rana Tour And Travels</h1>
          <p className="text-white/85 max-w-2xl text-lg font-normal leading-relaxed">
            Headquartered in Barnoh, Himachal Pradesh. Reach out for 24/7 taxi bookings, custom tour itineraries, and instant trip quotes.
          </p>
        </div>
      </section>

      <section className="container-app py-14 grid gap-10 md:grid-cols-2 relative">
        <EditBadge to="/admin/content/settings" label="Contact Info" />
        <div className="card p-8">
          <h2 className="font-display text-2xl font-bold text-navy mb-6">{settings.name || "Rana Tour And Travels"}</h2>
          <div className="space-y-4 text-navy/80">
            <p className="flex gap-3"><MapPin className="text-orange shrink-0" /> {settings.address}</p>
            {settings.phone && <p className="flex gap-3"><Phone className="text-orange shrink-0" /> {settings.phone}</p>}
          </div>
          <div className="flex flex-wrap gap-3 mt-8">
            {settings.phone && (
              <a href={`tel:${settings.phone.replace(/\s/g, "")}`} className="btn-primary flex items-center gap-2"><Phone size={16} /> Call</a>
            )}
            {settings.whatsapp && (
              <a href={`https://wa.me/${settings.whatsapp}`} target="_blank" rel="noreferrer" className="btn-primary bg-forest flex items-center gap-2"><MessageCircle size={16} /> WhatsApp</a>
            )}
            {settings.googleMapsUrl && (
              <a href={settings.googleMapsUrl} target="_blank" rel="noreferrer" className="btn-outline flex items-center gap-2"><Navigation size={16} /> Get Directions</a>
            )}
            <Link to="/enquiry" className="btn-accent">Send Enquiry</Link>
          </div>
        </div>

        <div className="rounded-card overflow-hidden card min-h-[320px]">
          <iframe
            title="Rana Tour And Travels location"
            className="w-full h-full min-h-[320px]"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            src={`https://www.google.com/maps?q=${encodeURIComponent(settings.address || "Barnoh, Himachal Pradesh 174303")}&output=embed`}
          />
        </div>
      </section>
    </div>
  );
}
