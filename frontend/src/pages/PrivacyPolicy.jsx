import { Link } from "react-router-dom";
import SEO from "../components/SEO";
import { useSettings } from "../context/SettingsContext";

const PrivacyPolicy = () => {
  const { settings } = useSettings();
  const company = settings.companyName || "BagHaus";
  const address = [settings.address, settings.city, settings.state, settings.country, settings.pincode].filter(Boolean).join(", ");
  return <>
    <SEO
      title="Privacy Policy"
      description={`Read how ${company} collects and uses information submitted through wholesale enquiries, contact forms and WhatsApp links.`}
      canonicalPath="/privacy"
    />
    <section className="section container-max py-16 sm:py-24 max-w-4xl">
      <div className="section-heading section-heading--wide mb-10">
        <p className="eyebrow">Your information</p>
        <h1 className="font-display text-4xl sm:text-5xl text-espresso">Privacy Policy</h1>
        <p className="text-sm text-espresso/50">Last updated October 12, 2026</p>
      </div>
      <div className="min-w-0 break-words bg-ivory border border-espresso/10 p-5 sm:p-10 space-y-8 text-sm sm:text-base leading-relaxed text-espresso/70">
        <p>{company} operates a business-to-business product catalogue for wholesale bags. This website does not provide customer accounts, shopping carts, online checkout, or online payment processing.</p>
        <section><h2 className="font-display text-xl text-espresso mb-2">Information you provide</h2><p>When you submit a contact or quote enquiry, we collect the details you enter, which may include your name, company, business email, phone or WhatsApp number, country, estimated quantity, product of interest, and message. Please avoid including sensitive personal information that is not needed for your business enquiry.</p></section>
        <section><h2 className="font-display text-xl text-espresso mb-2">How we use enquiry information</h2><p>We use these details to understand and respond to your wholesale enquiry, discuss product availability, pricing, samples, minimum order quantities, and follow up about that request. We do not use this website to take orders or payments. Enquiry records are stored in our application database and are available to authorized administrators for handling enquiries. We do not have an automatic deletion schedule; records are retained until they are deleted by an administrator or need to be kept for the enquiry, business records, or applicable legal requirements.</p></section>
        <section><h2 className="font-display text-xl text-espresso mb-2">Phone and WhatsApp</h2><p>You may contact us by phone or choose a WhatsApp link. Clicking a WhatsApp button creates an enquiry record containing the product name (if applicable), the pre-filled message, and the source of the click; it does not include a phone number or email entered by you. The button then opens WhatsApp with a suggested message. WhatsApp receives information when you use its service, and the message is sent only if you choose to send it. Phone and WhatsApp providers process communications under their own terms and privacy practices.</p></section>
        <section><h2 className="font-display text-xl text-espresso mb-2">Cookies, analytics, and local storage</h2><p>We have not found analytics, advertising pixels, or customer tracking cookies configured in this website. The admin sign-in stores an authentication token in browser local storage for the admin panel; this is not used for customer accounts. If an interactive Google Maps embed is configured on the Contact page, loading it connects your browser to Google, which may receive technical information and use its own technologies under Google’s terms.</p></section>
        <section><h2 className="font-display text-xl text-espresso mb-2">Technical information</h2><p>To deliver the site and limit abusive API requests, the application may process technical request details such as your IP address in temporary server memory. The hosting provider may keep its own operational logs depending on the hosting configuration. This information is used for site operation and security, not advertising profiles.</p></section>
        <section><h2 className="font-display text-xl text-espresso mb-2">Service providers and external links</h2><p>Enquiry details are processed by the website backend and stored in its MongoDB database. Website hosting and infrastructure providers may process technical data needed to deliver and secure the site. Website images and other media may be delivered by Cloudinary. The site also links to WhatsApp, social networks, email, telephone, and—when configured—Google Maps. These providers operate independently and their own privacy policies apply when you visit or use their services. We do not sell enquiry details.</p></section>
        <section><h2 className="font-display text-xl text-espresso mb-2">Security</h2><p>We use application and administrative access controls intended to protect enquiry information. No website or data transmission can be guaranteed completely secure. Please contact us if you believe information you sent to us has been exposed or used improperly.</p></section>
        <section><h2 className="font-display text-xl text-espresso mb-2">Your requests</h2><p>Depending on the law that applies to you, you may be able to ask us to provide access to, correct, or delete personal information you submitted, or raise a concern about how it is handled. Contact us using the details below or the <Link to="/contact" className="underline underline-offset-4 text-camel hover:text-espresso">Contact page</Link>. We may need to verify your request and may retain information where a legal or legitimate business record requirement applies.</p></section>
        <section><h2 className="font-display text-xl text-espresso mb-2">Policy updates</h2><p>We may update this notice when our website or information practices change. The latest update date will appear at the top of this page.</p></section>
        <section><h2 className="font-display text-xl text-espresso mb-2">Contact us about privacy</h2>
          {settings.email && <p>Email: <a href={`mailto:${settings.email}`} className="underline underline-offset-4 text-camel hover:text-espresso">{settings.email}</a></p>}
          {settings.phone && <p>Phone: <a href={`tel:${settings.phone}`} className="underline underline-offset-4 text-camel hover:text-espresso">{settings.phone}</a></p>}
          {address && <p>Address: {address}</p>}
          {!settings.email && !settings.phone && <p>Use our <Link to="/contact" className="underline underline-offset-4 text-camel hover:text-espresso">Contact page</Link> to reach the business using its current contact options.</p>}
          <p>{company}</p>
        </section>
      </div>
    </section>
  </>;
};

export default PrivacyPolicy;
