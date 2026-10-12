import { FaWhatsapp } from "react-icons/fa";
import { useSettings } from "../context/SettingsContext";
import api from "../api/axios";

const WhatsAppButton = ({ productName = "", variant = "inline", label = "WhatsApp Inquiry" }) => {
  const { settings } = useSettings();
  const number = (settings.whatsapp || "").replace(/[^0-9]/g, "");

  const handleClick = () => {
    const text = productName
      ? `Hi ${settings.companyName || "BagHaus"}, I'm interested in wholesale pricing for "${productName}". Could you share more details?`
      : `Hi ${settings.companyName || "BagHaus"}, I'd like to know more about your wholesale bag collections.`;

    // Log a lightweight inquiry record (non-blocking)
    api
      .post("/inquiries", {
        type: "whatsapp",
        name: "WhatsApp Click",
        email: "not-provided@baghaus.lead",
        phone: "not-provided",
        productName,
        message: text,
        source: "whatsapp-button",
      })
      .catch(() => {});

    const url = `https://wa.me/${number}?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  if (variant === "float") {
    return (
      <button
        onClick={handleClick}
        aria-label="Chat with us on WhatsApp"
        className="fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-tag transition-transform hover:scale-105"
      >
        <FaWhatsapp size={26} />
      </button>
    );
  }

  return (
    <button onClick={handleClick} className="btn-whatsapp">
      <FaWhatsapp size={18} />
      {label}
    </button>
  );
};

export default WhatsAppButton;
