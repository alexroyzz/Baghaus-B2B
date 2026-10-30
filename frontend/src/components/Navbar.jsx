import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FiMenu, FiX } from "react-icons/fi";
import { useSettings } from "../context/SettingsContext";
import { getImageUrl } from "../utils/image";

const links = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/products", label: "Products" },
  { to: "/categories", label: "Categories" },
  { to: "/contact", label: "Contact" },
];

const Navbar = () => {
  const { settings } = useSettings();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  const isHome = location.pathname === "/";
  // On the homepage the navbar overlays the full-screen hero image and stays
  // transparent until the visitor scrolls past it, then transitions smoothly
  // to a solid white bar. Every other page just gets the solid bar - there's
  // no hero image behind it to overlay.
  // Also go solid while the mobile menu is open so the bar and its panel read as one surface.
  const transparent = isHome && !scrolled && !open;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, [location.pathname]);

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!open) return undefined;
    const handleKeyDown = (event) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ease-out ${
        transparent
          ? "bg-transparent"
          : "bg-ivory/95 backdrop-blur-md shadow-[0_2px_24px_rgba(27,23,18,0.1)]"
      }`}
    >
      <div className="section container-max flex items-center justify-between h-20">
        <Link
          to="/"
          aria-label={`${settings.companyName || "BagHaus"} home`}
          className="flex min-h-11 items-center gap-2"
          onClick={() => setOpen(false)}
        >
          {getImageUrl(settings.logo) ? (
            <img
              src={getImageUrl(settings.logo, { width: 360 })}
              alt={settings.companyName}
              width="180"
              height="60"
              decoding="async"
              className="h-9 w-auto max-w-[60vw] object-contain"
            />
          ) : (
            <span
              className={`font-display text-2xl tracking-wide transition-colors duration-500 ${
                transparent ? "text-ivory" : "text-espresso"
              }`}
            >
              {settings.companyName || "BagHaus"}
            </span>
          )}
        </Link>

        <nav className="hidden lg:flex items-center gap-9">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.to === "/"}
              className={({ isActive }) =>
                `text-[13px] tracking-widest2 uppercase font-medium transition-colors duration-500 ${
                  isActive
                    ? transparent
                      ? "text-camel-light"
                      : "text-camel"
                    : transparent
                    ? "text-ivory/90 hover:text-camel-light"
                    : "text-espresso/80 hover:text-camel"
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden lg:flex items-center gap-4">
          <Link
            to="/contact"
            className={`btn-outline !py-2.5 transition-colors duration-500 ${
              transparent ? "!border-ivory/70 !text-ivory hover:!bg-ivory hover:!text-espresso" : ""
            }`}
          >
            Request Quote
          </Link>
        </div>

        <button
          type="button"
          className={`flex h-11 w-11 items-center justify-center rounded-full lg:hidden transition-colors duration-300 ${
            transparent ? "text-ivory hover:bg-ivory/10" : "text-espresso hover:bg-espresso/5"
          }`}
          onClick={() => setOpen(!open)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          aria-controls="mobile-primary-navigation"
        >
          {open ? <FiX size={26} /> : <FiMenu size={26} />}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="lg:hidden max-h-[calc(100dvh-5rem)] overflow-y-auto overscroll-contain bg-ivory border-t border-espresso/10 shadow-card"
          >
            <nav id="mobile-primary-navigation" aria-label="Primary navigation" className="flex flex-col px-6 py-5 gap-1">
              {links.map((l) => (
                <NavLink
                  key={l.to}
                  to={l.to}
                  end={l.to === "/"}
                  onClick={() => setOpen(false)}
                  className={({ isActive }) =>
                    `flex min-h-11 items-center rounded-lg px-3 text-sm tracking-widest2 uppercase font-medium transition-colors ${
                      isActive ? "bg-bone text-espresso" : "text-espresso/75 hover:bg-bone/70 hover:text-espresso"
                    }`
                  }
                >
                  {l.label}
                </NavLink>
              ))}
              <Link to="/contact" onClick={() => setOpen(false)} className="btn-primary w-full mt-2">
                Request Quote
              </Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
