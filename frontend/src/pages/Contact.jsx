import { useState } from "react";
import { motion } from "framer-motion";
import { FiMail, FiPhone, FiMapPin, FiClock } from "react-icons/fi";
import toast from "react-hot-toast";
import api from "../api/axios";
import SEO from "../components/SEO";
import { useSettings } from "../context/SettingsContext";
import WhatsAppButton from "../components/WhatsAppButton";
import CallButton from "../components/CallButton";

const initialForm = {
  name: "",
  company: "",
  email: "",
  phone: "",
  country: "",
  quantity: "",
  message: "",
};

const Contact = () => {
  const { settings } = useSettings();
  const [form, setForm] = useState(initialForm);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post("/inquiries", { type: "contact", ...form });
      toast.success("Message sent. Our wholesale team will respond within 24 hours.");
      setForm(initialForm);
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const infoItems = [
    settings.address && {
      icon: FiMapPin,
      label: "Address",
      value: [settings.address, settings.city, settings.state, settings.country].filter(Boolean).join(", "),
    },
    settings.phone && { icon: FiPhone, label: "Phone", value: settings.phone, href: `tel:${settings.phone}` },
    settings.email && { icon: FiMail, label: "Email", value: settings.email, href: `mailto:${settings.email}` },
    settings.supportHours && { icon: FiClock, label: "Hours", value: settings.supportHours },
  ].filter(Boolean);

  return (
    <>
      <SEO title="Contact" description="Get in touch with BagHaus's wholesale team for pricing, samples and bulk orders." />

      <section className="section container-max py-24 grid grid-cols-1 lg:grid-cols-5 gap-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="lg:col-span-2"
        >
          <p className="eyebrow mb-3">Get In Touch</p>
          <h1 className="font-display text-4xl sm:text-5xl text-espresso mb-6">Let's talk wholesale.</h1>
          <p className="text-espresso/60 leading-relaxed mb-10">
            Whether you're placing a first test order or scaling an existing program, our team responds to every
            inquiry within one business day.
          </p>

          <div className="space-y-6 mb-10">
            {infoItems.map((item) => (
              <div key={item.label} className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-camel/40 text-camel">
                  <item.icon size={16} />
                </div>
                <div>
                  <p className="text-[11px] uppercase tracking-widest2 text-espresso/40">{item.label}</p>
                  {item.href ? (
                    <a href={item.href} className="text-sm text-espresso hover:text-camel">
                      {item.value}
                    </a>
                  ) : (
                    <p className="text-sm text-espresso">{item.value}</p>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap gap-4 mb-10">
            <WhatsAppButton />
            <CallButton />
          </div>

          {settings.mapEmbedUrl && (
            <div className="border border-espresso/10 rounded-card overflow-hidden shadow-card">
              <iframe
                src={settings.mapEmbedUrl}
                title="Our location"
                width="100%"
                height="260"
                style={{ border: 0, display: "block" }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="lg:col-span-3 bg-bone panel-surface p-8 sm:p-12"
        >
          <h2 className="font-display text-2xl text-espresso mb-6">Send a Wholesale Inquiry</h2>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <input required name="name" value={form.name} onChange={handleChange} placeholder="Full name*" className="input bg-ivory" />
              <input name="company" value={form.company} onChange={handleChange} placeholder="Company name" className="input bg-ivory" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <input required type="email" name="email" value={form.email} onChange={handleChange} placeholder="Business email*" className="input bg-ivory" />
              <input required name="phone" value={form.phone} onChange={handleChange} placeholder="Phone / WhatsApp*" className="input bg-ivory" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <input name="country" value={form.country} onChange={handleChange} placeholder="Country" className="input bg-ivory" />
              <input name="quantity" value={form.quantity} onChange={handleChange} placeholder="Estimated quantity" className="input bg-ivory" />
            </div>
            <textarea
              name="message"
              value={form.message}
              onChange={handleChange}
              rows={5}
              placeholder="Tell us what you're looking for..."
              className="input bg-ivory resize-none"
            />
            <button type="submit" disabled={submitting} className="btn-primary w-full sm:w-auto disabled:opacity-60">
              {submitting ? "Sending..." : "Submit Inquiry"}
            </button>
          </form>
        </motion.div>
      </section>
    </>
  );
};

export default Contact;
