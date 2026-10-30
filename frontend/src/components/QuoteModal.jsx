import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { FiX } from "react-icons/fi";
import toast from "react-hot-toast";
import api from "../api/axios";

const initialForm = {
  name: "",
  company: "",
  email: "",
  phone: "",
  country: "",
  quantity: "",
  message: "",
};

const QuoteModal = ({ open, onClose, productName = "", productId = null }) => {
  const [form, setForm] = useState(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const dialogRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    const previousFocus = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    dialogRef.current?.focus();

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose();
        return;
      }
      if (event.key !== "Tab" || !dialogRef.current) return;

      const focusable = dialogRef.current.querySelectorAll(
        'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
      );
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && (document.activeElement === first || document.activeElement === dialogRef.current)) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
      if (previousFocus instanceof HTMLElement) previousFocus.focus();
    };
  }, [open, onClose]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post("/inquiries", {
        type: "quote",
        ...form,
        product: productId,
        productName,
      });
      toast.success("Quote request sent. Our team will reach out within 24 hours.");
      setForm(initialForm);
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-espresso/60 backdrop-blur-sm px-0 sm:px-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="quote-modal-title"
            aria-describedby="quote-modal-description"
            tabIndex={-1}
            className="relative w-full sm:max-w-lg max-h-[92dvh] overflow-y-auto overscroll-contain bg-ivory rounded-t-[28px] sm:rounded-card shadow-card-hover"
            initial={{ y: 60, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 40, opacity: 0 }}
            transition={{ type: "spring", damping: 26, stiffness: 260 }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={onClose}
              aria-label="Close quote form"
              className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-full text-espresso/70 transition-colors hover:bg-bone hover:text-espresso"
            >
              <FiX size={22} />
            </button>

            <div className="p-5 pt-16 sm:p-8 sm:pt-16">
              <p className="eyebrow mb-2">Wholesale Inquiry</p>
              <h2 id="quote-modal-title" className="font-display text-2xl sm:text-3xl text-espresso mb-1">Request a Quote</h2>
              <p id="quote-modal-description" className="text-sm text-espresso/60 mb-6">
                {productName ? `For "${productName}". ` : ""}Share a few details and our team will send pricing and MOQ within 24 hours.
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="sr-only" htmlFor="quote-name">Full name</label>
                    <input id="quote-name" required name="name" autoComplete="name" value={form.name} onChange={handleChange} placeholder="Full name*" className="input" />
                  </div>
                  <div>
                    <label className="sr-only" htmlFor="quote-company">Company name</label>
                    <input id="quote-company" name="company" autoComplete="organization" value={form.company} onChange={handleChange} placeholder="Company name" className="input" />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="sr-only" htmlFor="quote-email">Business email</label>
                    <input id="quote-email" required type="email" name="email" autoComplete="email" value={form.email} onChange={handleChange} placeholder="Business email*" className="input" />
                  </div>
                  <div>
                    <label className="sr-only" htmlFor="quote-phone">Phone or WhatsApp number</label>
                    <input id="quote-phone" required type="tel" name="phone" autoComplete="tel" value={form.phone} onChange={handleChange} placeholder="Phone / WhatsApp*" className="input" />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="sr-only" htmlFor="quote-country">Country</label>
                    <input id="quote-country" name="country" autoComplete="country-name" value={form.country} onChange={handleChange} placeholder="Country" className="input" />
                  </div>
                  <div>
                    <label className="sr-only" htmlFor="quote-quantity">Estimated quantity</label>
                    <input id="quote-quantity" name="quantity" inputMode="numeric" value={form.quantity} onChange={handleChange} placeholder="Estimated quantity" className="input" />
                  </div>
                </div>
                <label className="sr-only" htmlFor="quote-message">Tell us about your requirement</label>
                <textarea
                  id="quote-message"
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  rows={3}
                  placeholder="Tell us about your requirement (materials, colors, branding, timelines...)"
                  className="input resize-none"
                />

                <button type="submit" disabled={submitting} className="btn-primary w-full disabled:opacity-60">
                  {submitting ? "Sending..." : "Submit Inquiry"}
                </button>
                <p className="text-[11px] text-espresso/45 text-center">
                  We use your details to respond to this business enquiry. See our <Link to="/privacy" onClick={onClose} className="underline underline-offset-2 text-camel hover:text-espresso">Privacy Policy</Link>.
                </p>
              </form>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default QuoteModal;
