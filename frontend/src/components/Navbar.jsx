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
  const transparent = isHome && !scrolled;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, [location.pathname]);

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ease-out ${
        transparent
          ? "bg-transparent"
          : "bg-ivory/95 backdrop-blur-md shadow-[0_2px_24px_rgba(27,23,18,0.1)]"
      }`}
    >
      <div className="section container-max flex items-center justify-between h-20">
        <Link to="/" className="flex items-center gap-2" onClick={() => setOpen(false)}>
          {getImageUrl(settings.logo) ? (
            <img src={getImageUrl(settings.logo)} alt={settings.companyName} className="h-9 w-auto" />
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
          className={`lg:hidden transition-colors duration-500 ${transparent ? "text-ivory" : "text-espresso"}`}
          onClick={() => setOpen(!open)}
          aria-label={open ? "Close menu" : "Open menu"}
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
            className="lg:hidden overflow-hidden bg-ivory border-t border-espresso/10"
          >
            <nav className="flex flex-col px-6 py-6 gap-5">
              {links.map((l) => (
                <NavLink
                  key={l.to}
                  to={l.to}
                  end={l.to === "/"}
                  onClick={() => setOpen(false)}
                  className={({ isActive }) =>
                    `text-sm tracking-widest2 uppercase font-medium ${isActive ? "text-camel" : "text-espresso/80"}`
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
