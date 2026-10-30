import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiArrowUpRight, FiPackage, FiGlobe, FiShield } from "react-icons/fi";
import api from "../api/axios";
import { useSettings } from "../context/SettingsContext";
import { getResponsiveImage } from "../utils/image";
import SEO from "../components/SEO";
import CategoryCard from "../components/CategoryCard";
import ProductCard from "../components/ProductCard";
import CallButton from "../components/CallButton";
import WhatsAppButton from "../components/WhatsAppButton";
import Loader from "../components/Loader";
import Testimonials from "../components/Testimonials";

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
  const heroImage = getResponsiveImage(banner?.image, {
    width: 1920,
    height: 1200,
    sizes: "100vw",
  });
  const socialProfiles = Object.values(settings.social || {}).filter(Boolean);
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": "https://baghaus.in/#organization",
    name: settings.companyName || "Baghaus",
    url: "https://baghaus.in/",
    ...(settings.logo?.url ? { logo: settings.logo.url } : {}),
    ...(socialProfiles.length ? { sameAs: socialProfiles } : {}),
    ...(settings.phone || settings.email
      ? {
          contactPoint: {
            "@type": "ContactPoint",
            contactType: "sales",
            ...(settings.phone ? { telephone: settings.phone } : {}),
            ...(settings.email ? { email: settings.email } : {}),
          },
        }
      : {}),
  };
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": "https://baghaus.in/#website",
    name: settings.companyName || "Baghaus",
    url: "https://baghaus.in/",
    publisher: { "@id": "https://baghaus.in/#organization" },
  };

  return (
    <>
      <SEO
        exactTitle="Custom Cotton & Canvas Tote Bags | Baghaus"
        description="Custom cotton and canvas tote bags for business branding, retail, events and bulk orders. Explore reusable bags and request a wholesale quote from Baghaus."
        image={heroImage.src}
        canonicalPath="/"
        structuredData={[organizationSchema, websiteSchema]}
      />

      <div className="flex flex-col">
      {/* Hero */}
      <section className="relative hero-full order-1 w-full -mt-20 overflow-hidden bg-espresso sm:order-1">
        <img
          src={heroImage.src || heroImg}
          srcSet={heroImage.srcSet}
          sizes={heroImage.sizes}
          alt="BagHaus wholesale bag collection"
          width="1920"
          height="1200"
          loading="eager"
          fetchPriority="high"
          decoding="async"
          className="absolute inset-0 h-full w-full object-cover opacity-70"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-espresso via-espresso/40 to-espresso/10" />

        <div className="relative z-10 sm:h-full section container-max flex flex-col justify-start pt-24 pb-8 sm:justify-end sm:pt-0 sm:pb-20">
          
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="eyebrow !text-camel-light mb-2 !tracking-[0.18em] sm:mb-4 sm:!tracking-widest2"
          >
            Wholesale Bag Manufacturer
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="font-display text-4xl leading-[0.98] sm:text-6xl sm:leading-[1.05] lg:text-7xl text-ivory max-w-3xl"
          >
            {banner?.heading ||
              "Custom Cotton & Canvas Tote Bags for Business"}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="mt-3 max-w-sm text-sm leading-snug text-ivory/75 sm:mt-6 sm:max-w-xl sm:text-lg sm:leading-tight"
          >
            {banner?.subheading ||
              "Reusable tote bags for retail, events and brand promotions. Talk with our team about custom branding and wholesale quantities."}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="cta-row mt-5 sm:mt-9"
          >
            <Link to="/contact" className="btn-primary max-sm:ring-1 max-sm:ring-ivory/30">
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
      <section aria-label="Why businesses choose Baghaus" className="section container-max order-4 grid grid-cols-1 gap-5 border-b border-espresso/10 py-8 sm:order-2 sm:grid-cols-3 sm:gap-10 sm:py-12">
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
      <section className="section container-max order-2 py-8 sm:order-3 sm:py-16">
        <div className="flex items-end justify-between mb-6 sm:mb-10 flex-wrap gap-4">
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
          <div className="bleed-x flex snap-x snap-mandatory gap-3 overflow-x-auto overscroll-x-contain pb-3 sm:grid sm:grid-cols-3 sm:gap-6 sm:overflow-visible sm:pb-0 lg:grid-cols-6">
            {categories.map((category) => (
              <div key={category._id} className="w-[42vw] min-w-[148px] max-w-[185px] shrink-0 snap-start sm:w-auto sm:max-w-none">
                <CategoryCard category={category} />
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Featured products */}
      <section className="order-3 bg-bone py-8 sm:order-4 sm:py-20">
        <div className="section container-max">
          <div className="mb-6 sm:mb-10">
            <p className="eyebrow mb-3">Bestsellers</p>
            <h2 className="font-display text-3xl sm:text-4xl text-espresso">
              Featured Products
            </h2>
          </div>

          {loading ? (
            <Loader label="Loading products" />
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-4 lg:gap-8 min-[1200px]:grid-cols-5">
              {featured.map((p) => (
                <ProductCard key={p._id} product={p} variant="featured" />
              ))}
            </div>
          )}
        </div>
      </section>
      </div>

      <section className="section container-max py-14 sm:py-20">
        <div className="max-w-3xl mx-auto">
          <div className="section-heading section-heading--wide mb-6">
            <p className="eyebrow">Made for business</p>
            <h2 className="font-display text-3xl sm:text-4xl text-espresso">
              Custom tote bags for brands, events and retail
            </h2>
            <p className="text-espresso/65 leading-relaxed">
              Explore cotton and canvas tote bags for reusable shopping, corporate
              gifting and promotions. Share your preferred material, artwork and
              order quantity with our team to discuss a custom or bulk order.
            </p>
          </div>
          <div className="cta-row cta-row--center">
            <Link to="/products" className="btn-outline">Browse the wholesale catalogue</Link>
            <Link to="/contact" className="btn-primary">Discuss a custom order</Link>
          </div>
        </div>
      </section>

      <Testimonials />

      {/* CTA band */}
      <section className="relative bg-espresso py-16 sm:py-20 overflow-hidden">
        <div className="grain-overlay" />

        <div className="relative section container-max text-center max-w-2xl mx-auto">
          <div className="section-heading mb-7 sm:mb-9">
            <p className="eyebrow !text-camel-light">
              Let's Work Together
            </p>

            <h2 className="font-display text-3xl sm:text-4xl text-ivory">
              Ready to stock BagHaus in your store?
            </h2>

            <p className="text-ivory/60">
              Tell us your requirement — materials, quantities, branding — and our
              wholesale team will respond with pricing and samples.
            </p>
          </div>

          <div className="cta-row cta-row--center">
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
