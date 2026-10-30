import { Link } from "react-router-dom";
import { FaInstagram, FaFacebookF, FaLinkedinIn, FaXTwitter } from "react-icons/fa6";
import { useSettings } from "../context/SettingsContext";

const Footer = () => {
  const { settings } = useSettings();
  const year = new Date().getFullYear();

  const social = settings.social || {};
  const socialLinks = [
    { href: social.instagram, icon: FaInstagram, label: "Instagram" },
    { href: social.facebook, icon: FaFacebookF, label: "Facebook" },
    { href: social.x, icon: FaXTwitter, label: "X" },
    { href: social.linkedin, icon: FaLinkedinIn, label: "LinkedIn" },
  ].filter((s) => s.href);

  return (
    <footer className="bg-espresso text-ivory/80">
      <div className="section container-max grid grid-cols-1 gap-10 py-12 sm:grid-cols-2 sm:gap-10 sm:py-14 lg:grid-cols-4 lg:gap-12 lg:py-16">
        <div>
          <h3 className="font-display text-2xl text-ivory mb-3">{settings.companyName || "BagHaus"}</h3>
          <p className="text-sm leading-relaxed text-ivory/60 mb-4">
            {settings.tagline || "Wholesale Bags, Crafted for Business"}
          </p>
          {socialLinks.length > 0 && (
            <div className="flex gap-3">
              {socialLinks.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="flex h-9 w-9 items-center justify-center border border-ivory/20 rounded-full hover:border-camel hover:text-camel transition-colors"
                >
                  <s.icon size={14} />
                </a>
              ))}
            </div>
          )}
        </div>

        <div>
          <p className="eyebrow mb-4 !text-camel-light">Navigate</p>
          <ul className="space-y-2 text-sm">
            {[
              { label: "Home", to: "/" },
              { label: "About", to: "/about" },
              { label: "Products", to: "/products" },
              { label: "Categories", to: "/categories" },
              { label: "Contact", to: "/contact" },
              { label: "Privacy Policy", to: "/privacy" },
              { label: "Terms & Conditions", to: "/terms-and-conditions" },
            ].map((l) => (
              <li key={l.label}>
                <Link
                  to={l.to}
                  className="text-ivory/60 hover:text-camel transition-colors"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="eyebrow mb-4 !text-camel-light">Contact</p>
          <ul className="space-y-2 text-sm text-ivory/60">
            {settings.address && <li>{settings.address}</li>}
            {(settings.city || settings.state) && (
              <li>
                {[settings.city, settings.state, settings.country].filter(Boolean).join(", ")}
              </li>
            )}
            {settings.phone && (
              <li>
                <a href={`tel:${settings.phone}`} className="hover:text-camel">
                  {settings.phone}
                </a>
              </li>
            )}
            {settings.email && (
              <li>
                <a href={`mailto:${settings.email}`} className="hover:text-camel">
                  {settings.email}
                </a>
              </li>
            )}
          </ul>
        </div>

        <div>
          <p className="eyebrow mb-4 !text-camel-light">Trade Info</p>
          <ul className="space-y-2 text-sm text-ivory/60">
            {settings.gstin && <li>GSTIN: {settings.gstin}</li>}
            {settings.minOrderNote && <li>{settings.minOrderNote}</li>}
            <li>
              <Link to="/contact" className="underline underline-offset-4 hover:text-camel">
                Request wholesale catalog
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-ivory/10">
        <div className="section container-max py-5 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-ivory/40">
          <p>© {year} {settings.companyName || "BagHaus"}. All rights reserved.</p>
          <p>Built for wholesale buyers, retailers &amp; private-label brands.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
