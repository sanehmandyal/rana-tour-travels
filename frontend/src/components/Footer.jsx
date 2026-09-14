import { Link } from "react-router-dom";
import { Phone, MessageCircle, MapPin, Lock } from "lucide-react";
import { useContent } from "../context/ContentContext";
import BrandLogo from "./BrandLogo";

export default function Footer() {
  const { get } = useContent();
  const settings = get("settings", {});

  return (
    <footer className="bg-evening text-white mt-20 border-t border-white/10">
      <div className="container-app py-14 grid gap-10 md:grid-cols-4">
        <div>
          <div className="mb-4">
            <BrandLogo variant="dark" size="md" />
          </div>
          <p className="text-white/70 text-sm mt-3">{settings.tagline || "Explore • Travel • Create Memories"}</p>
        </div>

        <div>
          <h4 className="font-display font-semibold mb-3">Explore</h4>
          <ul className="space-y-2 text-sm text-white/75">
            <li><Link to="/services" className="hover:text-gold">Services</Link></li>
            <li><Link to="/tour-packages" className="hover:text-gold">Tour Packages</Link></li>
            <li><Link to="/destinations" className="hover:text-gold">Destinations</Link></li>
            <li><Link to="/gallery" className="hover:text-gold">Gallery</Link></li>
            <li><Link to="/reviews" className="hover:text-gold">Reviews</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-display font-semibold mb-3">Company</h4>
          <ul className="space-y-2 text-sm text-white/75">
            <li><Link to="/about" className="hover:text-gold">About Us</Link></li>
            <li><Link to="/contact" className="hover:text-gold">Contact</Link></li>
            <li><Link to="/faq" className="hover:text-gold">FAQ</Link></li>
            <li><Link to="/privacy-policy" className="hover:text-gold">Privacy Policy</Link></li>
            <li><Link to="/terms-and-conditions" className="hover:text-gold">Terms & Conditions</Link></li>
            <li><Link to="/cancellation-policy" className="hover:text-gold">Cancellation Policy</Link></li>
            <li>
              <Link to="/admin/login" className="hover:text-gold text-white/60 flex items-center gap-1.5 pt-1">
                <Lock size={13} className="text-gold/80" /> Admin Portal
              </Link>
            </li>
          </ul>
        </div>

        <div className="space-y-3 text-sm text-white/80">
          <h4 className="font-display font-semibold mb-1 text-white">Get in Touch</h4>
          {settings.address && (
            <p className="flex gap-2"><MapPin size={18} className="shrink-0 text-gold" /> {settings.address}</p>
          )}
          {settings.phone && (
            <a href={`tel:${settings.phone.replace(/\s/g, "")}`} className="flex gap-2 hover:text-gold">
              <Phone size={18} className="shrink-0 text-gold" /> {settings.phone}
            </a>
          )}
          {settings.whatsapp && (
            <a href={`https://wa.me/${settings.whatsapp}`} target="_blank" rel="noreferrer" className="flex gap-2 hover:text-gold">
              <MessageCircle size={18} className="shrink-0 text-gold" /> WhatsApp Us
            </a>
          )}
        </div>
      </div>
      <div className="border-t border-white/10 py-5">
        <div className="container-app flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-white/50">
          <div>© {new Date().getFullYear()} Rana Tour And Travels. All rights reserved.</div>
          <div className="flex items-center gap-4">
            <Link to="/reviews" className="hover:text-gold transition">Write a Review</Link>
            <span>•</span>
            <Link to="/admin/login" className="hover:text-gold flex items-center gap-1 transition text-white/60">
              <Lock size={12} /> Admin Login
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
