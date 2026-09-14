import { useContent } from "../context/ContentContext";
import EditBadge from "../components/EditBadge";
import { ImageIcon } from "lucide-react";

export default function Gallery() {
  const { get } = useContent();
  const items = get("gallery", { items: [] }).items || [];

  return (
    <div>
      <section
        className="relative overflow-hidden text-white py-20"
        style={{
          backgroundImage:
            "linear-gradient(180deg, rgba(8,43,58,0.78) 0%, rgba(8,43,58,0.88) 100%), url(/images/banners/gallery-banner.jpg)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="container-app">
          <p className="text-gold font-bold text-sm uppercase tracking-widest mb-2">Visual Journeys</p>
          <h1 className="font-display text-4xl md:text-5xl font-extrabold mb-3">Our Photo Gallery</h1>
          <p className="text-white/85 max-w-2xl text-lg font-normal leading-relaxed">
            Real moments from the road — snow-capped peaks, alpine valleys, sanitized luxury cabs, and memorable road trips across Himachal.
          </p>
        </div>
      </section>

      <section className="container-app py-16 relative">
        <EditBadge to="/admin/content/gallery" label="Gallery" />
        {items.length === 0 ? (
          <div className="text-center py-20 text-navy/50">
            <ImageIcon className="mx-auto mb-3" size={40} />
            No gallery images yet. The admin can add photos from the admin panel.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {items.map((item, i) => (
              <div
                key={i}
                className="group relative rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 bg-navy/5 aspect-4/3"
              >
                {item.image && (
                  <img
                    src={item.image}
                    alt={item.title || "Gallery image"}
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                    loading="lazy"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-navy/90 via-navy/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-5">
                  {item.title && (
                    <p className="text-white font-display font-bold text-sm leading-snug drop-shadow-sm">
                      {item.title}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
