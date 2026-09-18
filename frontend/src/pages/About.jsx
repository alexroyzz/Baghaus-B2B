import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiCheckCircle } from "react-icons/fi";
import SEO from "../components/SEO";
import CallButton from "../components/CallButton";
import WhatsAppButton from "../components/WhatsAppButton";
import { useSettings } from "../context/SettingsContext";
import { getImageUrl } from "../utils/image";

const placeholderImg =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='900' height='1100'%3E%3Crect width='100%25' height='100%25' fill='%23EFE8DA'/%3E%3C/svg%3E";

// Shared frame styling so both About-page images read as one consistent,
// premium-feeling treatment regardless of size.
const imgFrame = "img-frame";

const qualityPoints = [
  "Every batch checked against the original spec sheet before packing",
  "Stitching, hardware and finish inspected piece by piece, not by sample",
  "Reorders matched against the first shipment for exact consistency",
];

const stats = [
  ["12+", "Years of Experience"],
  ["300+", "Wholesale Clients"],
  ["1", "Across India"],
  ["50K+", "Products Delivered"],
];

const About = () => {
  const { settings } = useSettings();
  const images = settings.aboutImages || [];
  const manufacturingImg = getImageUrl(images[0]) || placeholderImg;
  const qualityImg = getImageUrl(images[1]) || placeholderImg;
  const qualityVideo = getImageUrl(settings.aboutVideo);
  const companyName = settings.companyName || "BagHaus";

  return (
    <>
      <SEO
        title="About"
        description="Learn about BagHaus — a premium wholesale bag manufacturer built for retailers and brands."
      />

      {/* Section 1 — Our Story (no image, centered) */}
      <section className="section container-max py-24 sm:py-14">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl mx-auto text-center"
        >
          <p className="eyebrow mb-4">Our Story</p>
          <h1 className="font-display text-4xl sm:text-5xl text-espresso leading-tight mb-6">
            A wholesale bag house built on craft, not shortcuts.
          </h1>
          <p className="text-espresso/65 leading-relaxed mb-4">
            {companyName} was founded on a simple premise: retailers and brands
            deserve a wholesale partner that treats every order — big or small —
            with the same attention to material, construction and finish.
          </p>
          <p className="text-espresso/65 leading-relaxed">
            Today, our catalog spans handbags, totes, backpacks, clutches and
            travel bags, produced for boutiques, department stores, e-commerce
            brands and distributors in over 40 countries.
          </p>
        </motion.div>
      </section>

      {/* Section 2 — Manufacturing (large image left, copy right) */}
      <section className="bg-bone py-24">
        <div className="section container-max grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="order-1"
          >
            <div
              className={`${imgFrame} w-full max-w-[480px] h-[300px] sm:h-[360px] lg:h-[430px] mx-auto`}
            >
              <img
                src={manufacturingImg}
                alt={`${companyName} manufacturing facility`}
                className="w-full h-full object-cover"
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="order-2"
          >
            <p className="eyebrow mb-4">Manufacturing</p>
            <h2 className="font-display text-3xl sm:text-4xl text-espresso leading-tight mb-6">
              Production built for wholesale scale
            </h2>
            <p className="text-espresso/65 leading-relaxed mb-4">
              Our production lines run on a mix of skilled hand-finishing and
              precision machinery, letting us hold tight tolerances across
              cutting, stitching and hardware assembly at volume.
            </p>
            <p className="text-espresso/65 leading-relaxed mb-4">
              From a 100-unit test order to a multi-container program, capacity
              is planned in advance so lead times stay predictable and quality
              never gets traded for speed.
            </p>
            <p className="text-espresso/65 leading-relaxed">
              Every material — leather, canvas, hardware — is sourced against
              approved supplier standards, so the sample you approve is exactly
              what ships.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Section 3 — Quality Control (copy left, smaller image right) */}
      <section className="section container-max py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="order-2 lg:order-1"
          >
            <p className="eyebrow mb-4">Quality Control</p>
            <h2 className="font-display text-3xl sm:text-4xl text-espresso leading-tight mb-6">
              Every batch inspected before it ships
            </h2>
            <p className="text-espresso/65 leading-relaxed mb-4">
              Quality checks happen at three stages — incoming materials,
              mid-production and pre-dispatch — so issues are caught long before
              a container leaves the facility.
            </p>
            <p className="text-espresso/65 leading-relaxed mb-6">
              We work as an extension of your buying team, with transparent
              costing, honest timelines and real people you can reach directly.
            </p>
            <ul className="space-y-3">
              {qualityPoints.map((point) => (
                <li
                  key={point}
                  className="flex items-start gap-3 text-sm text-espresso/70"
                >
                  <FiCheckCircle
                    className="mt-0.5 shrink-0 text-camel"
                    size={16}
                  />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="order-1 lg:order-2 max-w-sm mx-auto lg:mx-0 lg:ml-auto w-full"
          >
            <div className={`${imgFrame} w-full aspect-[4/5]`}>
              {qualityVideo ? (
                <video
                  src={qualityVideo}
                  autoPlay
                  muted
                  loop
                  playsInline
                  controls={false}
                  className="h-full w-full object-cover"
                  aria-label={`${companyName} quality inspection`}
                />
              ) : (
                <img
                  src={qualityImg}
                  alt={`${companyName} quality inspection`}
                  className="h-full w-full object-cover"
                />
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Section 4 — Company Impact / Statistics */}
      <section className="bg-espresso py-24 relative overflow-hidden">
        <div className="grain-overlay" />
        <div className="relative section container-max">
          <div className="text-center max-w-xl mx-auto mb-14">
            <p className="eyebrow !text-camel-light mb-3">Company Impact</p>
            <h2 className="font-display text-3xl sm:text-4xl text-ivory">
              Numbers built over a decade of shipping
            </h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 text-center">
            {stats.map(([num, label]) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <p className="font-display text-4xl sm:text-5xl text-camel-light mb-2">
                  {num}
                </p>
                <p className="text-xs tracking-widest2 uppercase text-ivory/55">
                  {label}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 5 — Final CTA */}
      <section className="section container-max py-24 text-center max-w-2xl mx-auto">
        <p className="eyebrow mb-4">Let's Work Together</p>
        <h2 className="font-display text-3xl sm:text-4xl text-espresso mb-5">
          Ready to stock {companyName} in your store?
        </h2>
        <p className="text-espresso/60 mb-9">
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
      </section>
    </>
  );
};

export default About;
