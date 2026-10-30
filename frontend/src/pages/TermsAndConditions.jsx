import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import SEO from "../components/SEO";

// Official contact details supplied for the legal terms. Kept as constants so
// the legal text never depends on admin-editable settings.
const CONTACT = {
  name: "Baghaus",
  email: "canvasbaghaus@gmail.com",
  whatsappDisplay: "+91 7009271737",
  whatsappLink: "https://wa.me/917009271737",
};

const linkCls = "underline underline-offset-4 text-camel hover:text-espresso break-words";

// NOTE FOR REVIEWERS: "LEGAL REVIEW" comments mark clauses that a qualified
// Indian lawyer should check before this page is relied upon.
const sections = [
  {
    id: "introduction",
    title: "Introduction and Acceptance of Terms",
    body: (
      <>
        <p>These Terms and Conditions (“Terms”) govern your access to and use of this website and any wholesale enquiry, quotation or order you discuss with {CONTACT.name} (“Baghaus”, “we”, “us” or “our”).</p>
        <p>By using this website, or by placing or confirming an order with us, you confirm that you have read and understood these Terms and agree to be bound by them. If you do not agree, please do not use the website or place an order with us.</p>
        <p>These Terms should be read together with our <Link to="/privacy" className={linkCls}>Privacy Policy</Link>.</p>
      </>
    ),
  },
  {
    id: "business-overview",
    title: "Business Overview",
    body: (
      <>
        <p>Baghaus operates as a business-to-business (B2B) wholesale bags supplier. This website is a product catalogue and lead-generation platform.</p>
        <p>The website does not provide direct online checkout or payment processing. You can contact Baghaus through WhatsApp, phone or the enquiry forms on this website to discuss products, pricing and orders. An order is arranged directly with Baghaus and is subject to the terms below.</p>
      </>
    ),
  },
  {
    id: "products",
    title: "Products and Product Information",
    body: (
      <>
        <p>We make reasonable efforts to describe and display our products accurately. Product images are provided for reference purposes only.</p>
        <p>Minor variations in colour, material, dimensions or design may occur between the images or descriptions shown on the website and the products supplied, including due to screen settings, lighting and manufacturing processes.</p>
        <p>Product availability, specifications and catalogue content may change without prior notice.</p>
      </>
    ),
  },
  {
    id: "wholesale-orders-moq",
    title: "Wholesale Orders and Minimum Order Quantity (MOQ)",
    body: (
      <>
        <p>Baghaus supplies products on a wholesale basis. The Minimum Order Quantity (MOQ) may vary depending on the product, and some products may not have a fixed MOQ.</p>
        <p>The applicable MOQ and quantity for your order will be discussed and confirmed with you before the order is finalised.</p>
      </>
    ),
  },
  {
    id: "pricing-payment",
    title: "Pricing and Payment Terms",
    body: (
      <>
        <p>Product prices are displayed on the website. {/* LEGAL REVIEW: the brief does not say whether displayed prices are fixed or indicative, or whether they include/exclude taxes and freight. Confirm with the business and add wording if needed. */}The price, quantity and payment terms applicable to your order will be confirmed with you when the order is discussed and confirmed.</p>
        <p>A partial advance payment is required to proceed with an order. The remaining payment must be cleared before dispatch.</p>
        <p>Payment terms may vary depending on the order and will be communicated to you at the time of order confirmation.</p>
      </>
    ),
  },
  {
    id: "custom-design",
    title: "Custom Design and Logo Printing",
    body: (
      <>
        <p>Baghaus offers custom bag designs and logo printing. The specifications, artwork, quantity and timelines for a custom order are agreed with the customer before production begins.</p>
        <p>Custom-designed orders are subject to the cancellation terms set out in the “Order Cancellation Policy” section below.</p>
      </>
    ),
  },
  {
    id: "intellectual-property-artwork",
    title: "Intellectual Property and Customer-Provided Artwork",
    body: (
      <>
        <p>You are responsible for ensuring that you own, or hold all necessary rights, licences and permissions to use, any logo, artwork, trademark, text or design that you provide to Baghaus for a custom order.</p>
        <p>By providing such material, you confirm that its use and reproduction on the products will not infringe the rights of any third party. {/* LEGAL REVIEW: indemnity wording below. Enforceability and scope should be reviewed by a lawyer. */}You agree to be responsible for any claim, loss or liability arising from your use of material you do not have the right to use.</p>
        <p>Baghaus may decline or pause any custom order where it reasonably believes the artwork may infringe the rights of others or is unlawful or inappropriate.</p>
      </>
    ),
  },
  {
    id: "order-confirmation",
    title: "Order Confirmation and Processing",
    body: (
      <>
        <p>An order is considered confirmed only when Baghaus has reviewed the order details and confirmed them to you, and the required advance payment has been received.</p>
        <p>Enquiries, quotation requests or messages sent through the website, WhatsApp or phone do not by themselves create a confirmed order. Production and processing begin after confirmation.</p>
      </>
    ),
  },
  {
    id: "cancellation",
    title: "Order Cancellation Policy",
    body: (
      <>
        <ul className="list-disc pl-5 space-y-2">
          <li><strong className="text-espresso font-medium">Custom-designed orders</strong> cannot be cancelled once production has started or the product has been manufactured.</li>
          <li><strong className="text-espresso font-medium">Orders using existing Baghaus catalogue designs</strong> may be eligible for cancellation before dispatch.</li>
        </ul>
        <p>All cancellation requests must be reviewed and confirmed by Baghaus. A request is not treated as accepted until Baghaus confirms it to you. {/* LEGAL REVIEW: the brief does not state what happens to the advance payment on an approved cancellation. Consider adding a clear clause (e.g. refund, deduction or adjustment) once the business decides. */}</p>
        <p>To request a cancellation, please contact us as soon as possible using the details in the “Contact Information” section.</p>
      </>
    ),
  },
  {
    id: "shipping-delivery",
    title: "Shipping and Delivery",
    body: (
      <>
        <p>Baghaus offers pan-India delivery.</p>
        <p>Delivery timelines depend on the product type, order quantity and customisation requirements. Any timeline shared is an estimate and not a guaranteed delivery date.</p>
        <p>Courier delays and unforeseen circumstances may affect delivery. Baghaus will keep customers informed about significant delivery delays.</p>
        <p>Remaining payment must be cleared before dispatch, as set out in “Pricing and Payment Terms”.</p>
      </>
    ),
  },
  {
    id: "damaged-defective",
    title: "Damaged or Defective Products",
    body: (
      <>
        <p>If you receive a damaged or defective product, please contact us as soon as possible with your order details and, where possible, clear photographs of the product and packaging. {/* LEGAL REVIEW: no reporting deadline is stated in the brief. Consider whether the business wants a time limit for reporting issues. */}</p>
        <p>All complaints are reviewed on a case-by-case basis. A replacement, refund or another suitable resolution will be determined after Baghaus reviews the issue.</p>
      </>
    ),
  },
  {
    id: "returns-refunds",
    title: "Returns, Refunds and Replacements",
    body: (
      <>
        <p>Because Baghaus supplies wholesale and, in many cases, custom-made products, returns are not accepted as a matter of routine. Where a product is found to be damaged or defective, the resolution (replacement, refund or another suitable remedy) is decided after review as described in the “Damaged or Defective Products” section.</p>
        <p>Minor variations in colour, material, dimensions or design, as described in “Products and Product Information”, are not by themselves treated as defects.</p>
        <p>Where a refund is approved, Baghaus will confirm the amount and the method of refund to you. {/* LEGAL REVIEW: the "no routine returns" position and refund timelines should be confirmed with the business and checked against applicable consumer/commercial law. */}</p>
      </>
    ),
  },
  {
    id: "customer-responsibilities",
    title: "Customer Responsibilities",
    body: (
      <>
        <p>As a customer, you agree to:</p>
        <ul className="list-disc pl-5 space-y-2">
          <li>provide accurate and complete business, contact, delivery and order information;</li>
          <li>carefully review product details, quantities, specifications and artwork before confirming an order;</li>
          <li>make payments as agreed, including the advance and the remaining payment before dispatch;</li>
          <li>ensure you have the rights to any artwork or logo you supply; and</li>
          <li>use this website only for lawful business purposes.</li>
        </ul>
      </>
    ),
  },
  {
    id: "privacy-marketing",
    title: "Privacy and Marketing Communications",
    body: (
      <>
        <p>Information you share with us may be used to handle your enquiry and for business communication with you. We may also send promotional communications by WhatsApp and email.</p>
        <p>Marketing communications will respect applicable consent and opt-out requirements. You may ask us to stop promotional messages at any time by contacting us using the details below. {/* LEGAL REVIEW: confirm that consent is actually collected and an opt-out process is operating, and check alignment with the Digital Personal Data Protection Act, 2023 and applicable telecom/messaging rules. */}</p>
        <p>For more detail on how information is handled, please read our <Link to="/privacy" className={linkCls}>Privacy Policy</Link>.</p>
      </>
    ),
  },
  {
    id: "website-content-ip",
    title: "Website Content and Intellectual Property",
    body: (
      <>
        <p>The content of this website, including text, images, product photographs, designs, graphics, logos and layout, belongs to Baghaus or is used with permission, and may not be copied, reproduced, distributed or used for commercial purposes without our prior written consent.</p>
        <p>Product designs and catalogue images are shown for reference. Nothing on this website grants you a licence to use Baghaus branding or content except as expressly agreed in writing.</p>
      </>
    ),
  },
  {
    id: "limitation-liability",
    title: "Limitation of Liability",
    body: (
      <>
        <p>To the maximum extent permitted by applicable law, Baghaus will not be liable for indirect, incidental or consequential loss, or for loss of profit, business or goodwill, arising from the use of this website or from an order. {/* LEGAL REVIEW: scope and any monetary cap on liability should be set by a lawyer. No cap has been invented here. */}</p>
        <p>This website is provided for information and enquiry purposes, and we do not guarantee that it will always be available, uninterrupted or error-free.</p>
        <p>Nothing in these Terms excludes or limits any liability or any right you have that cannot be excluded or limited under applicable Indian law.</p>
      </>
    ),
  },
  {
    id: "force-majeure",
    title: "Force Majeure",
    body: (
      <>
        <p>Baghaus will not be responsible for any delay or failure to perform its obligations caused by events beyond its reasonable control. These may include natural disasters, fire, floods, epidemics, strikes, labour disputes, transport or courier disruptions, supply shortages, government actions or restrictions, power or internet failures, and other unforeseen circumstances.</p>
        <p>Where such an event significantly affects your order, Baghaus will keep you informed.</p>
      </>
    ),
  },
  {
    id: "changes-to-terms",
    title: "Changes to Terms and Conditions",
    body: (
      <>
        <p>Baghaus may update these Terms from time to time. The latest update date is shown at the top of this page, and the updated Terms apply from the time they are published on the website.</p>
        <p>Orders already confirmed will generally continue under the Terms in force when they were confirmed, unless both parties agree otherwise. {/* LEGAL REVIEW: confirm this transitional position. */}</p>
      </>
    ),
  },
  {
    id: "governing-law",
    title: "Governing Law and Jurisdiction",
    body: (
      <>
        <p>These Terms are governed by the laws of India. Subject to any mandatory rights that cannot be excluded under applicable law, the courts at Delhi, India shall have jurisdiction over any dispute arising out of or in connection with these Terms or any order. {/* LEGAL REVIEW: confirm the jurisdiction clause (exclusive vs non-exclusive) and whether any arbitration or dispute-resolution step is wanted. */}</p>
      </>
    ),
  },
  {
    id: "contact-information",
    title: "Contact Information",
    body: (
      <>
        <p>For questions about these Terms, or to discuss an order, cancellation or complaint, please contact us:</p>
        <ul className="space-y-1">
          <li>Business name: {CONTACT.name}</li>
          <li>Email: <a href={`mailto:${CONTACT.email}`} className={linkCls}>{CONTACT.email}</a></li>
          <li>WhatsApp: <a href={CONTACT.whatsappLink} target="_blank" rel="noopener noreferrer" className={linkCls}>{CONTACT.whatsappDisplay}</a></li>
        </ul>
        <p>You can also use our <Link to="/contact" className={linkCls}>Contact page</Link> to send an enquiry.</p>
      </>
    ),
  },
];

const TermsAndConditions = () => {
  const [showTop, setShowTop] = useState(false);

  // The site has no global scroll-reset on navigation, so start at the top
  // when arriving from the footer link.
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 600);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <SEO
        title="Terms & Conditions"
        description="Terms and conditions for wholesale enquiries and orders with Baghaus, a B2B wholesale bags supplier."
        canonicalPath="/terms-and-conditions"
      />
      <section className="section container-max py-16 sm:py-24">
        <div className="section-heading section-heading--wide mb-10">
          <p className="eyebrow">Legal</p>
          <h1 className="font-display text-4xl sm:text-5xl text-espresso">Terms &amp; Conditions</h1>
          <p className="text-sm text-espresso/50 mb-5">Last updated October 30, 2026</p>
          <p className="text-base text-espresso/70 leading-relaxed">
            Please read these terms carefully before placing a wholesale enquiry or order with Baghaus. They explain how orders, payments, custom designs, cancellations and delivery work.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[18rem_minmax(0,1fr)] gap-10 lg:gap-14 items-start">
          {/* Contents: collapsible on mobile, sticky on desktop */}
          <aside className="lg:sticky lg:top-28 lg:self-start">
            <details className="lg:hidden bg-ivory border border-espresso/10 rounded-card shadow-card p-5 group">
              <summary className="cursor-pointer list-none flex items-center justify-between font-display text-lg text-espresso">
                Contents
                <span aria-hidden="true" className="text-camel transition-transform group-open:rotate-45 text-xl leading-none">+</span>
              </summary>
              <nav aria-label="Terms contents" className="mt-4">
                <ol className="space-y-2 text-sm text-espresso/70">
                  {sections.map((s, i) => (
                    <li key={s.id}>
                      <a href={`#${s.id}`} className="hover:text-camel transition-colors">{i + 1}. {s.title}</a>
                    </li>
                  ))}
                </ol>
              </nav>
            </details>

            <nav aria-label="Terms contents" className="hidden lg:block bg-ivory border border-espresso/10 rounded-card shadow-card p-6 max-h-[calc(100vh-9rem)] overflow-y-auto">
              <p className="eyebrow mb-4">Contents</p>
              <ol className="space-y-2 text-sm text-espresso/70">
                {sections.map((s, i) => (
                  <li key={s.id}>
                    <a href={`#${s.id}`} className="hover:text-camel transition-colors">{i + 1}. {s.title}</a>
                  </li>
                ))}
              </ol>
            </nav>
          </aside>

          <div className="bg-ivory border border-espresso/10 rounded-card lg:rounded-card-lg shadow-card p-6 sm:p-10 space-y-10 text-sm sm:text-base leading-relaxed text-espresso/70 min-w-0">
            {sections.map((s, i) => (
              <section key={s.id} id={s.id} className="scroll-mt-28">
                <h2 className="font-display text-xl sm:text-2xl text-espresso mb-3 flex gap-3">
                  <span className="text-camel tabular-nums">{String(i + 1).padStart(2, "0")}</span>
                  <span>{s.title}</span>
                </h2>
                <div className="space-y-3">{s.body}</div>
              </section>
            ))}
          </div>
        </div>
      </section>

      {showTop && (
        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          aria-label="Back to top"
          className="fixed bottom-24 right-6 z-40 flex h-11 w-11 items-center justify-center rounded-full bg-espresso text-ivory shadow-tag transition-colors hover:bg-camel"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 19V5M5 12l7-7 7 7" /></svg>
        </button>
      )}
    </>
  );
};

export default TermsAndConditions;
