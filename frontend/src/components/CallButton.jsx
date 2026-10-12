import { FiPhoneCall } from "react-icons/fi";
import { useSettings } from "../context/SettingsContext";

const variantClasses = {
  primary: "btn-primary",
  outline: "btn-outline",
  // Solid camel/golden accent — the default "Call Now" treatment. Reads
  // clearly on both light and dark (e.g. espresso CTA) sections since it
  // doesn't rely on the surrounding background color for contrast.
  accent: "btn-accent",
};

const CallButton = ({ variant = "accent", label = "Call Now" }) => {
  const { settings } = useSettings();
  const phone = settings.phone || "";

  return (
    <a href={`tel:${phone}`} className={variantClasses[variant] || variantClasses.accent}>
      <FiPhoneCall size={16} />
      {label}
    </a>
  );
};

export default CallButton;
