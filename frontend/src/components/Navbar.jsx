import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { Link, NavLink, useLocation } from "react-router-dom";
import {
  Menu,
  X,
  Phone,
  MessageCircle,
  Lock,
  Home,
  Info,
  Car,
  Compass,
  MapPin,
  Image,
  Star,
  Mail,
  ChevronRight,
} from "lucide-react";
import { useContent } from "../context/ContentContext";
import BrandLogo from "./BrandLogo";

const LINKS = [
  { to: "/", label: "Home", icon: Home },
  { to: "/about", label: "About", icon: Info },
  { to: "/services", label: "Services", icon: Car },
  { to: "/tour-packages", label: "Packages", icon: Compass },
  { to: "/destinations", label: "Destinations", icon: MapPin },
  { to: "/gallery", label: "Gallery", icon: Image },
  { to: "/reviews", label: "Reviews", icon: Star },
  { to: "/contact", label: "Contact", icon: Mail },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const { get } = useContent();
  const settings = get("settings", {});
  const phone = settings.phone || "";
  const whatsapp = settings.whatsapp || "";

  // Auto-close menu when navigation occurs
  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  // Lock body scroll when mobile drawer is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-black/5 shadow-xs">
        <div className="container-app flex items-center justify-between h-20">
          <BrandLogo variant="light" size="md" />

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-6">
            {LINKS.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                className={({ isActive }) =>
                  `text-sm font-semibold transition-colors ${
                    isActive ? "text-orange" : "text-navy/80 hover:text-teal"
                  }`
                }
              >
                {l.label}
              </NavLink>
            ))}
          </nav>

          {/* Desktop Right Actions */}
          <div className="hidden lg:flex items-center gap-3">
            {phone && (
              <a
                href={`tel:${phone.replace(/\s/g, "")}`}
                className="btn-outline flex items-center gap-2 !py-2 !px-4 text-xs font-semibold"
              >
                <Phone size={15} /> Call Now
              </a>
            )}
            <Link to="/enquiry" className="btn-accent !py-2 !px-4 text-xs font-semibold">
              Plan Your Trip
            </Link>
            <Link
              to="/admin/login"
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-navy/75 hover:text-navy bg-slate-100 hover:bg-slate-200/80 rounded-lg transition border border-slate-200"
              title="Admin Portal Login"
            >
              <Lock size={13} className="text-orange" /> Admin Login
            </Link>
          </div>

          {/* Mobile Actions & Hamburger Toggle */}
          <div className="flex items-center gap-2 lg:hidden">
            {phone && (
              <a
                href={`tel:${phone.replace(/\s/g, "")}`}
                aria-label="Call Now"
                className="w-10 h-10 rounded-xl bg-orange/10 text-orange flex items-center justify-center border border-orange/20 active:scale-95 transition"
              >
                <Phone size={18} />
              </a>
            )}
            <button
              className="w-11 h-11 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-navy flex items-center justify-center active:scale-95 transition"
              onClick={() => setOpen(true)}
              aria-label="Open mobile menu"
            >
              <Menu size={24} />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Rendered in document.body via Portal to Avoid Stacking / Clipping Bugs */}
      {open &&
        createPortal(
          <div className="fixed inset-0 z-[9999] lg:hidden flex justify-end animate-fadeIn">
            {/* Dark Backdrop Overlay */}
            <div
              className="fixed inset-0 bg-navy/60 backdrop-blur-xs transition-opacity duration-300"
              onClick={() => setOpen(false)}
              aria-hidden="true"
            />

            {/* Sliding Drawer Container */}
            <aside
              className="relative w-full max-w-xs sm:max-w-sm h-full bg-white shadow-2xl flex flex-col z-[10000] animate-slideLeft"
              role="dialog"
              aria-modal="true"
              aria-label="Mobile Navigation"
            >
              {/* Drawer Top Bar */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 bg-slate-50/70">
                <BrandLogo variant="light" size="sm" onClick={() => setOpen(false)} />
                <button
                  onClick={() => setOpen(false)}
                  aria-label="Close menu"
                  className="w-9 h-9 rounded-lg bg-white hover:bg-gray-100 border border-gray-200 text-navy flex items-center justify-center transition active:scale-95"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Scrollable Navigation Options Area */}
              <div className="flex-1 overflow-y-auto px-4 py-4 space-y-1 overscroll-contain">
                <p className="px-3 pt-1 pb-2 text-[11px] font-bold uppercase tracking-wider text-navy/40">
                  Navigation Menu
                </p>

                {LINKS.map((l) => {
                  const Icon = l.icon;
                  return (
                    <NavLink
                      key={l.to}
                      to={l.to}
                      onClick={() => setOpen(false)}
                      className={({ isActive }) =>
                        `flex items-center justify-between px-3.5 py-3 rounded-xl text-sm font-semibold transition-all ${
                          isActive
                            ? "bg-orange/10 text-orange border-l-4 border-orange font-bold shadow-xs"
                            : "text-navy/80 hover:bg-slate-50 hover:text-teal"
                        }`
                      }
                    >
                      <span className="flex items-center gap-3">
                        <Icon size={18} className="shrink-0 opacity-80" />
                        <span>{l.label}</span>
                      </span>
                      <ChevronRight size={15} className="opacity-40" />
                    </NavLink>
                  );
                })}

                {/* Divider */}
                <div className="pt-3 pb-1">
                  <div className="border-t border-gray-100" />
                </div>

                {/* Admin Direct Access Option inside Options List */}
                <NavLink
                  to="/admin/login"
                  onClick={() => setOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center justify-between px-3.5 py-3 rounded-xl text-sm font-semibold transition-all ${
                      isActive
                        ? "bg-navy text-white font-bold"
                        : "text-navy/70 hover:bg-slate-100"
                    }`
                  }
                >
                  <span className="flex items-center gap-3">
                    <Lock size={18} className="shrink-0 text-orange" />
                    <span>Admin Login Portal</span>
                  </span>
                  <ChevronRight size={15} className="opacity-40" />
                </NavLink>
              </div>

              {/* Drawer Bottom Quick Action Buttons */}
              <div className="p-4 border-t border-gray-100 bg-slate-50/80 space-y-2.5">
                <Link
                  to="/enquiry"
                  onClick={() => setOpen(false)}
                  className="btn-accent w-full text-center flex items-center justify-center gap-2 !py-2.5 text-sm shadow-md"
                >
                  <Compass size={16} /> Plan Your Trip
                </Link>

                <div className="grid grid-cols-2 gap-2">
                  {phone && (
                    <a
                      href={`tel:${phone.replace(/\s/g, "")}`}
                      className="btn-outline !py-2 !px-2 text-xs flex items-center justify-center gap-1.5 font-semibold text-center truncate"
                    >
                      <Phone size={13} className="shrink-0" /> Call
                    </a>
                  )}
                  {whatsapp && (
                    <a
                      href={`https://wa.me/${whatsapp}`}
                      target="_blank"
                      rel="noreferrer"
                      className="btn-primary !py-2 !px-2 text-xs flex items-center justify-center gap-1.5 font-semibold text-center truncate bg-[#25D366] hover:bg-[#128C7E]"
                    >
                      <MessageCircle size={13} className="shrink-0" /> WhatsApp
                    </a>
                  )}
                </div>
              </div>
            </aside>
          </div>,
          document.body
        )}
    </>
  );
}
