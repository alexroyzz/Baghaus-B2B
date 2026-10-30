import mongoose from "mongoose";

const settingsSchema = new mongoose.Schema(
  {
    key: { type: String, default: "site_settings", unique: true },

    // Company details
    companyName: { type: String, default: "BagHaus" },
    tagline: { type: String, default: "Wholesale Bags, Crafted for Business" },
    gstin: { type: String, default: "" },
    cin: { type: String, default: "" },
    address: { type: String, default: "" },
    city: { type: String, default: "" },
    state: { type: String, default: "" },
    country: { type: String, default: "India" },
    pincode: { type: String, default: "" },

    // Location map - Google Maps embed URL (Share > Embed a map > copy the
    // src="..." value from Google Maps), editable from Admin Settings and
    // rendered as an iframe on the public Contact page.
    mapEmbedUrl: { type: String, default: "" },

    // Contact
    email: { type: String, default: "" },
    phone: { type: String, default: "" },
    whatsapp: { type: String, default: "" },
    supportHours: { type: String, default: "Mon - Sat, 10:00 AM - 7:00 PM IST" },

    // Branding
    logo: {
      url: { type: String, default: "" },
      public_id: { type: String, default: "" },
    },
    favicon: {
      url: { type: String, default: "" },
      public_id: { type: String, default: "" },
    },
    heroBanners: [
      {
        image: {
          url: { type: String, default: "" },
          public_id: { type: String, default: "" },
        },
        heading: { type: String, default: "" },
        subheading: { type: String, default: "" },
        ctaText: { type: String, default: "" },
        ctaLink: { type: String, default: "" },
      },
    ],

    // About page images - exactly two slots by design: [0] is the large
    // manufacturing/factory shot, [1] is the smaller quality-control /
    // finished-product supporting shot. Only url + public_id are persisted
    // per asset; the rest of the Cloudinary asset lives on Cloudinary itself.
    aboutImages: [
      {
        url: { type: String, default: "" },
        public_id: { type: String, default: "" },
      },
    ],

    // About page video - a single optional Cloudinary video asset shown in
    // the Quality Control section. When empty, the About page falls back to
    // the existing aboutImages[1] / placeholder image behaviour unchanged.
    aboutVideo: {
      url: { type: String, default: "" },
      public_id: { type: String, default: "" },
    },

    // Social links
    social: {
      instagram: { type: String, default: "" },
      facebook: { type: String, default: "" },
      x: { type: String, default: "" },
      linkedin: { type: String, default: "" },
    },

    // SEO
    seoTitle: { type: String, default: "BagHaus | Premium Wholesale Bags for Retailers & Brands" },
    seoDescription: {
      type: String,
      default:
        "BagHaus is a premium B2B wholesale bag manufacturer supplying handbags, totes, backpacks and accessories to retailers and brands worldwide.",
    },
    seoKeywords: { type: String, default: "wholesale bags, bulk handbags, B2B bag manufacturer" },

    // Misc
    minOrderNote: { type: String, default: "Minimum order quantities apply. Contact us for wholesale pricing." },
    maintenanceMode: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model("Settings", settingsSchema);
