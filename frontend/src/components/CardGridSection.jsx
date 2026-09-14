import { MapPin } from "lucide-react";
import EditBadge from "./EditBadge";

// Renders a titled section with a responsive grid of image/title/description
// cards, sourced straight from a SiteContent section. Used for Services,
// Destinations, Why Us, Gallery-style previews, etc. so admin edits to that
// section's `items` array show up everywhere it's used.
export default function CardGridSection({
  eyebrow,
  title,
  subtitle,
  items = [],
  editKey,
  columns = "md:grid-cols-2 lg:grid-cols-4",
  ctaLabel,
  onCardClick,
  emptyMessage = "Content coming soon.",
}) {
  return (
    <section className="container-app py-16 relative">
      {editKey && <EditBadge to={`/admin/content/${editKey}`} label={title || editKey} />}
      <div className="max-w-2xl mx-auto text-center mb-10">
        {eyebrow && <p className="text-orange font-semibold text-sm mb-2">{eyebrow}</p>}
        {title && <h2 className="font-display text-3xl md:text-4xl font-bold text-navy mb-3">{title}</h2>}
        {subtitle && <p className="text-navy/70">{subtitle}</p>}
      </div>

      {items.length === 0 ? (
        <p className="text-center text-navy/50 py-10">{emptyMessage}</p>
      ) : (
        <div className={`grid grid-cols-1 sm:grid-cols-2 ${columns} gap-6`}>
          {items.map((item, i) => (
            <button
              key={i}
              onClick={() => onCardClick?.(item, i)}
              className={`group card overflow-hidden text-left transition-all duration-300 hover:shadow-xl hover:-translate-y-1.5 border border-slate-200/80 bg-white flex flex-col ${
                onCardClick ? "cursor-pointer" : "cursor-default"
              }`}
            >
              {/* Image Area with Badge & Overlay */}
              <div className="relative h-48 sm:h-52 bg-slate-100 overflow-hidden shrink-0">
                {item.image ? (
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-108"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-sky">
                    <MapPin className="text-teal/40" size={40} />
                  </div>
                )}
                {/* Subtle dark gradient overlay on bottom of image for contrast */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-300" />
                
                {/* Optional Badge */}
                {item.badge && (
                  <div className="absolute top-3 left-3 bg-navy/85 backdrop-blur-md text-white text-[11px] font-bold px-2.5 py-1 rounded-full shadow-md tracking-wide">
                    {item.badge}
                  </div>
                )}

                {/* Map Badge Button if mapUrl exists */}
                {item.mapUrl && (
                  <a
                    href={item.mapUrl}
                    target="_blank"
                    rel="noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="absolute top-3 right-3 bg-white/90 hover:bg-white text-navy text-[11px] font-bold px-2.5 py-1 rounded-full shadow-md flex items-center gap-1 transition backdrop-blur-md hover:text-teal"
                    title={`View ${item.title} on Google Maps`}
                  >
                    <MapPin size={12} className="text-orange" />
                    <span>Map</span>
                  </a>
                )}
              </div>

              {/* Card Body */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-display font-bold text-lg text-navy mb-1.5 group-hover:text-teal transition-colors">
                    {item.title}
                  </h3>
                  {item.description && (
                    <p className="text-sm text-navy/70 line-clamp-3 leading-relaxed">
                      {item.description}
                    </p>
                  )}
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    {item.price && (
                      <span className="text-xs font-bold text-teal bg-teal/10 px-2.5 py-1 rounded-md">
                        {item.price}
                      </span>
                    )}
                    {item.mapUrl && (
                      <a
                        href={item.mapUrl}
                        target="_blank"
                        rel="noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="text-xs font-bold text-teal/80 hover:text-teal inline-flex items-center gap-1 py-0.5 hover:underline"
                      >
                        <MapPin size={13} className="text-orange" /> View on Map
                      </a>
                    )}
                  </div>
                  {ctaLabel && (
                    <span className="text-xs font-bold text-orange group-hover:translate-x-1 transition-transform inline-flex items-center gap-1 shrink-0">
                      {ctaLabel} →
                    </span>
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </section>
  );
}
