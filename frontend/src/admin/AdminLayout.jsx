import { useState } from "react";
import { NavLink, Outlet, Link } from "react-router-dom";
import {
  LayoutDashboard, Inbox, Star, Settings, LogOut, Menu, X, ExternalLink,
  Image as ImageIcon, MapPin, Package, Wrench, HelpCircle,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

const NAV = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/admin/enquiries", label: "Enquiries", icon: Inbox },
  { to: "/admin/content/hero", label: "Homepage Hero", icon: LayoutDashboard },
  { to: "/admin/content/services", label: "Services", icon: Wrench },
  { to: "/admin/content/destinations", label: "Destinations", icon: MapPin },
  { to: "/admin/content/packages", label: "Tour Packages", icon: Package },
  { to: "/admin/content/gallery", label: "Gallery", icon: ImageIcon },
  { to: "/admin/reviews", label: "Reviews", icon: Star },
  { to: "/admin/content/faqs", label: "FAQs", icon: HelpCircle },
  { to: "/admin/content/about", label: "About Page", icon: LayoutDashboard },
  { to: "/admin/content/settings", label: "Business Settings", icon: Settings },
];

import BrandLogo from "../components/BrandLogo";

export default function AdminLayout() {
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuth();

  const SidebarContent = (
    <div className="flex flex-col h-full">
      <div className="px-5 py-5 border-b border-white/10">
        <BrandLogo variant="dark" size="sm" linkTo="/admin" showTagline={false} className="mb-1" />
        <p className="text-white/40 text-xs truncate mt-1.5">{user?.email || "Administrator"}</p>
      </div>
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
        {NAV.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            onClick={() => setOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition ${
                isActive ? "bg-white/10 text-gold" : "text-white/75 hover:bg-white/5 hover:text-white"
              }`
            }
          >
            <item.icon size={17} />
            {item.label}
          </NavLink>
        ))}
      </nav>
      <div className="p-3 border-t border-white/10 space-y-1">
        <Link to="/" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-white/75 hover:bg-white/5 hover:text-white">
          <ExternalLink size={17} /> View Site
        </Link>
        <button onClick={logout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-white/75 hover:bg-white/5 hover:text-white">
          <LogOut size={17} /> Logout
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-sky flex">
      {/* Desktop sidebar */}
      <aside className="hidden lg:block w-64 bg-navy shrink-0">{SidebarContent}</aside>

      {/* Mobile drawer */}
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setOpen(false)} />
          <div className="absolute left-0 top-0 h-full w-72 bg-navy shadow-2xl">{SidebarContent}</div>
        </div>
      )}

      <div className="flex-1 min-w-0">
        <header className="lg:hidden sticky top-0 z-30 bg-navy text-white flex items-center justify-between px-4 h-14">
          <button onClick={() => setOpen(true)} aria-label="Open admin menu"><Menu size={22} /></button>
          <span className="font-display font-semibold text-sm">Rana Admin</span>
          <Link to="/" aria-label="View site"><ExternalLink size={18} /></Link>
        </header>
        <main className="p-4 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
