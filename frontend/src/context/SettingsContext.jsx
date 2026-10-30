import { createContext, useContext, useEffect, useState } from "react";
import api from "../api/axios";
import { getImageUrl } from "../utils/image";

const defaultSettings = {
  companyName: "BagHaus",
  tagline: "Wholesale Bags, Crafted for Business",
  email: "",
  phone: "",
  whatsapp: "",
  logo: { url: "", public_id: "" },
  favicon: { url: "", public_id: "" },
  social: { instagram: "", facebook: "", x: "", linkedin: "" },
  gstin: "",
  address: "",
  city: "",
  state: "",
  country: "India",
  mapEmbedUrl: "",
  seoTitle: "BagHaus | Premium Wholesale Bags for Retailers & Brands",
  seoDescription: "",
  minOrderNote: "",
  heroBanners: [],
  // Exactly two About-page images by design: [0] large manufacturing shot,
  // [1] smaller quality-control / finished-product shot.
  aboutImages: [],
  // Optional single About-page video shown in the Quality Control section.
  // Falls back to aboutImages[1] / placeholder when empty.
  aboutVideo: { url: "", public_id: "" },
};

const SettingsContext = createContext({ settings: defaultSettings, loading: true });

export const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState(defaultSettings);
  const [loading, setLoading] = useState(true);

  const refresh = async () => {
    try {
      const res = await api.get("/settings");
      setSettings({ ...defaultSettings, ...res.data.data });
    } catch {
      setSettings(defaultSettings);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
  }, []);

  // Reflect the admin-uploaded favicon (stored on Cloudinary) on the page,
  // falling back to the static /favicon.svg shipped in the build otherwise.
  useEffect(() => {
    const faviconUrl = getImageUrl(settings.favicon);
    if (!faviconUrl) return;
    let link = document.querySelector("link[rel='icon']");
    if (!link) {
      link = document.createElement("link");
      link.rel = "icon";
      document.head.appendChild(link);
    }
    link.href = faviconUrl;
  }, [settings.favicon]);

  return (
    <SettingsContext.Provider value={{ settings, loading, refresh }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => useContext(SettingsContext);
