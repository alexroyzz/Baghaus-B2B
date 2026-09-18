import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiArrowUpRight, FiPackage, FiGlobe, FiShield } from "react-icons/fi";
import api from "../api/axios";
import { useSettings } from "../context/SettingsContext";
import { getImageUrl } from "../utils/image";
import SEO from "../components/SEO";
import CategoryCard from "../components/CategoryCard";
import ProductCard from "../components/ProductCard";
import CallButton from "../components/CallButton";
import WhatsAppButton from "../components/WhatsAppButton";
import Loader from "../components/Loader";

const heroImg =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1600' height='1000'%3E%3Crect width='100%25' height='100%25' fill='%23EFE8DA'/%3E%3C/svg%3E";

const trust = [
  {
    icon: FiPackage,
    title: "Bulk Ready",
    desc: "Flexible MOQs built for retailers, distributors and private-label brands.",
  },
  {
    icon: FiGlobe,
    title: "Global Shipping",
    desc: "FOB and DDP shipping arranged to major ports worldwide.",
  },
  {
    icon: FiShield,
    title: "Quality Assured",
    desc: "Every batch is inspected against agreed spec sheets before dispatch.",
  },
];

const Home = () => {
  const { settings } = useSettings();
  const [categories, setCategories] = useState([]);
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get("/categories"),
      api.get("/products?featured=true&limit=8"),
    ])
      .then(([catRes, prodRes]) => {
        setCategories(catRes.data.data.slice(0, 6));
        setFeatured(prodRes.data.data);
      })
      .finally(() => setLoading(false));
  }, []);

  const banner = settings.heroBanners?.[0];

  return (
    <>
      <SEO />

      {/* Hero */}
      <section className="relative hero-full w-full -mt-20 overflow-hidden bg-espresso">
        <img
          src={getImageUrl(banner?.image) || heroImg}
          alt="BagHaus wholesale bag collection"
          className="absolute inset-0 h-full w-full object-cover opacity-70"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-espresso via-espresso/40 to-espresso/10" />

        <div className="relative z-10 sm:h-full section container-max flex flex-col justify-start pt-28 pb-6 sm:justify-end sm:pt-0 sm:pb-20">
          
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="eyebrow !text-camel-light mb-1 sm:mb-4"
          >
            Wholesale Bag Manufacturer
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            // heading
className="font-display text-3xl sm:text-6xl lg:text-7xl leading-[1.02] sm:leading-[1.05] text-ivory max-w-3xl"
          >
            {banner?.heading ||
              "Bags, built for the businesses that carry them further."}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            // description
className="mt-2 sm:mt-6 max-w-xl text-ivory/70 text-xs sm:text-lg leading-tight"
          >
            {banner?.subheading ||
              "BagHaus supplies handbags, totes, backpacks and travel bags in bulk to retailers, distributors and private-label brands worldwide."}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
    // buttons
className="mt-3 sm:mt-9 flex flex-wrap gap-2 sm:gap-4"
          >
            <Link to="/contact" className="btn-primary">
              Request Quote <FiArrowUpRight />
            </Link>

            <Link
              to="/products"
              className="btn-outline !border-ivory/40 !text-ivory hover:!bg-ivory hover:!text-espresso"
            >
              Browse Products
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Trust strip */}
      <section className="section container-max py-16 hidden sm:grid sm:grid-cols-3 gap-10 border-b border-espresso/10">
        {trust.map((t, i) => (
          <motion.div
            key={t.title}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            className="flex items-start gap-4"
          >
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-camel/40 text-camel">
              <t.icon size={18} />
            </div>

            <div>
              <h3 className="font-display text-lg text-espresso mb-1">
                {t.title}
              </h3>
              <p className="text-sm text-espresso/60 leading-relaxed">
                {t.desc}
              </p>
            </div>
          </motion.div>
        ))}
      </section>

      {/* Categories */}
      <section className="section container-max py-10 sm:py-16">
        <div className="flex items-end justify-between mb-8 sm:mb-10 flex-wrap gap-4">
          <div>
            <p className="eyebrow mb-2 sm:mb-3">Collections</p>

            <h2 className="font-display text-3xl sm:text-4xl text-espresso">
              Shop by Category
            </h2>
          </div>
        </div>

        {loading ? (
          <Loader label="Loading collections" />
        ) : (
          <div className="flex overflow-x-auto gap-4 pb-2 -mx-6 px-6 snap-x snap-mandatory scrollbar-hide sm:grid sm:grid-cols-3 lg:grid-cols-6 sm:gap-6 sm:overflow-visible sm:pb-0 sm:mx-0 sm:px-0">
            {categories.map((c, i) => (
              <div
                key={c._id}
                className="w-[42%] shrink-0 snap-start sm:w-auto"
              >
                <CategoryCard category={c} index={i} />
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Featured products */}
      <section className="bg-bone py-6  sm:py-24">
        <div className="section container-max">
          <div className="flex items-end justify-between mb-10 flex-wrap gap-4">
            <div>
              <p className="eyebrow mb-3">Bestsellers</p>

              <h2 className="font-display text-3xl sm:text-4xl text-espresso">
                Featured Products
              </h2>
            </div>
          </div>

          {loading ? (
            <Loader label="Loading products" />
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
              {featured.map((p, i) => (
                <ProductCard key={p._id} product={p} index={i} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA band */}
      <section className="relative bg-espresso py-24 overflow-hidden">
        <div className="grain-overlay" />

        <div className="relative section container-max text-center max-w-2xl mx-auto">
          <p className="eyebrow !text-camel-light mb-4">
            Let's Work Together
          </p>

          <h2 className="font-display text-3xl sm:text-4xl text-ivory mb-5">
            Ready to stock BagHaus in your store?
          </h2>

          <p className="text-ivory/60 mb-9">
            Tell us your requirement — materials, quantities, branding — and our
            wholesale team will respond with pricing and samples.
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/contact" className="btn-primary">
              Request Quote
            </Link>

            <WhatsAppButton />
            <CallButton />
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;