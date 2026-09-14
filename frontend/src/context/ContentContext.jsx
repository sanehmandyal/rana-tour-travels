import { createContext, useContext, useEffect, useState, useCallback } from "react";
import client from "../api/client";
import {
  DEFAULT_SETTINGS,
  DEFAULT_HERO,
  DEFAULT_SERVICES,
  DEFAULT_DESTINATIONS,
  DEFAULT_PACKAGES,
  DEFAULT_GALLERY,
  DEFAULT_WHY_US,
  DEFAULT_FAQS,
  DEFAULT_ABOUT,
} from "../data/defaultContent";

const DEFAULTS = {
  settings: DEFAULT_SETTINGS,
  hero: DEFAULT_HERO,
  services: { items: DEFAULT_SERVICES },
  destinations: { items: DEFAULT_DESTINATIONS },
  packages: { items: DEFAULT_PACKAGES },
  gallery: { items: DEFAULT_GALLERY },
  whyUs: { items: DEFAULT_WHY_US },
  faqs: { items: DEFAULT_FAQS },
  about: DEFAULT_ABOUT,
  footer: { note: "Explore Himachal Pradesh with Rana Tour And Travels." },
};

const ContentContext = createContext(null);

export function ContentProvider({ children }) {
  const [sections, setSections] = useState({});
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await client.get("/content");
      setSections(data.sections || {});
    } catch (err) {
      // Backend not running or offline; fallbacks are active
      console.warn("Using local defaults for site content:", err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const get = (key, fallback) => {
    const section = sections[key]?.data;
    const def = DEFAULTS[key];

    if (!section) return def ?? fallback;

    // Smart merge for list sections (services, destinations, packages, whyUs, gallery)
    if (Array.isArray(section.items)) {
      if (section.items.length === 0 && def?.items?.length) {
        return def;
      }
      const defItems = def?.items || [];
      const mergedItems = section.items.map((item, idx) => {
        const matched =
          defItems.find((d) => d.title?.toLowerCase() === item.title?.toLowerCase()) ||
          defItems[idx] ||
          {};
        return {
          ...matched,
          ...item,
          image:
            item.image && item.image.trim() !== ""
              ? item.image
              : matched.image || "",
          badge: item.badge || matched.badge || "",
          mapUrl: item.mapUrl || matched.mapUrl || "",
          price: item.price || matched.price || "",
        };
      });
      return { ...section, items: mergedItems };
    }

    // Smart merge for object sections (hero, about, settings)
    if (typeof section === "object") {
      return {
        ...def,
        ...section,
        backgroundImage:
          section.backgroundImage && section.backgroundImage.trim() !== ""
            ? section.backgroundImage
            : def?.backgroundImage || "",
      };
    }

    return section;
  };

  return (
    <ContentContext.Provider value={{ sections, get, loading, reload: load }}>
      {children}
    </ContentContext.Provider>
  );
}

export function useContent() {
  return useContext(ContentContext);
}
