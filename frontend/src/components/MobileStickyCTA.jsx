import { Phone, MessageCircle, Send } from "lucide-react";
import { Link } from "react-router-dom";
import { useContent } from "../context/ContentContext";

export default function MobileStickyCTA() {
  const { get } = useContent();
  const settings = get("settings", {});

  return (
    <div className="fixed bottom-0 inset-x-0 z-30 lg:hidden bg-white border-t border-black/10 shadow-[0_-4px_20px_rgba(0,0,0,0.08)]">
      <div className="grid grid-cols-3">
        {settings.phone && (
          <a href={`tel:${settings.phone.replace(/\s/g, "")}`} className="flex flex-col items-center justify-center py-2.5 gap-0.5 text-navy">
            <Phone size={18} />
            <span className="text-[11px] font-semibold">Call</span>
          </a>
        )}
        {settings.whatsapp && (
          <a href={`https://wa.me/${settings.whatsapp}`} target="_blank" rel="noreferrer" className="flex flex-col items-center justify-center py-2.5 gap-0.5 text-forest">
            <MessageCircle size={18} />
            <span className="text-[11px] font-semibold">WhatsApp</span>
          </a>
        )}
        <Link to="/enquiry" className="flex flex-col items-center justify-center py-2.5 gap-0.5 bg-orange text-white">
          <Send size={18} />
          <span className="text-[11px] font-semibold">Enquire</span>
        </Link>
      </div>
    </div>
  );
}
