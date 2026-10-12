import { useEffect, useState } from "react";
import { FiPlus, FiTrash2 } from "react-icons/fi";
import toast from "react-hot-toast";
import api from "../../api/axios";
import Loader from "../../components/Loader";
import ImageUploader from "./ImageUploader";
import { useSettings } from "../../context/SettingsContext";

const AdminSettings = () => {
  const { refresh } = useSettings();
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api
      .get("/settings")
      .then((res) => setForm(res.data.data))
      .finally(() => setLoading(false));
  }, []);

  const set = (key, value) => setForm({ ...form, [key]: value });
  const setSocial = (key, value) => setForm({ ...form, social: { ...form.social, [key]: value } });

  const updateBanner = (idx, key, value) => {
    const banners = [...form.heroBanners];
    banners[idx] = { ...banners[idx], [key]: value };
    setForm({ ...form, heroBanners: banners });
  };

  const addBanner = () => setForm({ ...form, heroBanners: [...(form.heroBanners || []), { image: null, heading: "", subheading: "", ctaText: "", ctaLink: "" }] });
  const removeBanner = (idx) => setForm({ ...form, heroBanners: form.heroBanners.filter((_, i) => i !== idx) });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.put("/settings", form);
      toast.success("Settings updated.");
      refresh();
    } catch (err) {
      toast.error(err.response?.data?.message || "Save failed.");
    } finally {
      setSaving(false);
    }
  };

  if (loading || !form) return <Loader label="Loading settings" />;

  return (
    <div>
      <h1 className="font-display text-3xl text-espresso mb-8">Website Settings</h1>

      <form onSubmit={handleSubmit} className="space-y-10 max-w-3xl">
        {/* Branding */}
        <section className="bg-ivory border border-espresso/10 p-7">
          <h2 className="font-display text-lg text-espresso mb-5">Branding</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-5">
            <div>
              <label className="text-[11px] uppercase tracking-widest2 text-espresso/50 mb-1.5 block">Logo</label>
              <ImageUploader value={form.logo} onChange={(img) => set("logo", img)} folder="branding" />
            </div>
            <div>
              <label className="text-[11px] uppercase tracking-widest2 text-espresso/50 mb-1.5 block">Favicon</label>
              <ImageUploader value={form.favicon} onChange={(img) => set("favicon", img)} folder="branding" />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input placeholder="Company name" value={form.companyName} onChange={(e) => set("companyName", e.target.value)} className="input" />
            <input placeholder="Tagline" value={form.tagline} onChange={(e) => set("tagline", e.target.value)} className="input" />
          </div>
        </section>

        {/* Company & GST details */}
        <section className="bg-ivory border border-espresso/10 p-7">
          <h2 className="font-display text-lg text-espresso mb-5">Company & Tax Details</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <input placeholder="GSTIN" value={form.gstin} onChange={(e) => set("gstin", e.target.value)} className="input" />
            <input placeholder="CIN (if applicable)" value={form.cin} onChange={(e) => set("cin", e.target.value)} className="input" />
          </div>
          <input placeholder="Address" value={form.address} onChange={(e) => set("address", e.target.value)} className="input mb-4" />
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <input placeholder="City" value={form.city} onChange={(e) => set("city", e.target.value)} className="input" />
            <input placeholder="State" value={form.state} onChange={(e) => set("state", e.target.value)} className="input" />
            <input placeholder="Country" value={form.country} onChange={(e) => set("country", e.target.value)} className="input" />
            <input placeholder="Pincode" value={form.pincode} onChange={(e) => set("pincode", e.target.value)} className="input" />
          </div>
        </section>

        {/* Location map */}
        <section className="bg-ivory border border-espresso/10 p-7">
          <h2 className="font-display text-lg text-espresso mb-2">Location Map</h2>
          <p className="text-sm text-espresso/50 mb-5">
            Paste a Google Maps embed URL. In Google Maps: search your address → Share → Embed a map → copy only
            the URL inside <code>src="..."</code> from the code shown, and paste it here. Leave empty to hide the
            map on the Contact page.
          </p>
          <input
            placeholder="https://www.google.com/maps/embed?pb=..."
            value={form.mapEmbedUrl || ""}
            onChange={(e) => set("mapEmbedUrl", e.target.value)}
            className="input"
          />
          {form.mapEmbedUrl && (
            <div className="mt-4 border border-espresso/10">
              <iframe
                src={form.mapEmbedUrl}
                title="Map preview"
                width="100%"
                height="260"
                style={{ border: 0, display: "block" }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          )}
        </section>

        {/* Contact */}
        <section className="bg-ivory border border-espresso/10 p-7">
          <h2 className="font-display text-lg text-espresso mb-5">Contact Details</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <input placeholder="Email" value={form.email} onChange={(e) => set("email", e.target.value)} className="input" />
            <input placeholder="Phone (used for Call Now)" value={form.phone} onChange={(e) => set("phone", e.target.value)} className="input" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input placeholder="WhatsApp number (with country code, no +)" value={form.whatsapp} onChange={(e) => set("whatsapp", e.target.value)} className="input" />
            <input placeholder="Support hours" value={form.supportHours} onChange={(e) => set("supportHours", e.target.value)} className="input" />
          </div>
        </section>

        {/* Social links */}
        <section className="bg-ivory border border-espresso/10 p-7">
          <h2 className="font-display text-lg text-espresso mb-5">Social Media Links</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input placeholder="Instagram URL" value={form.social?.instagram || ""} onChange={(e) => setSocial("instagram", e.target.value)} className="input" />
            <input placeholder="Facebook URL" value={form.social?.facebook || ""} onChange={(e) => setSocial("facebook", e.target.value)} className="input" />
            <input placeholder="X (Twitter) URL" value={form.social?.x || ""} onChange={(e) => setSocial("x", e.target.value)} className="input" />
            <input placeholder="LinkedIn URL" value={form.social?.linkedin || ""} onChange={(e) => setSocial("linkedin", e.target.value)} className="input" />
          </div>
        </section>

        {/* Hero banners */}
        <section className="bg-ivory border border-espresso/10 p-7">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-display text-lg text-espresso">Homepage Banners</h2>
            <button type="button" onClick={addBanner} className="btn-outline !py-2 !px-4 text-xs">
              <FiPlus size={14} /> Add Banner
            </button>
          </div>
          <div className="space-y-6">
            {(form.heroBanners || []).map((b, i) => (
              <div key={i} className="border border-espresso/10 p-5 relative">
                <button type="button" onClick={() => removeBanner(i)} className="absolute top-3 right-3 text-espresso/40 hover:text-rust">
                  <FiTrash2 size={14} />
                </button>
                <ImageUploader value={b.image} onChange={(img) => updateBanner(i, "image", img)} folder="hero-banners" />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                  <input placeholder="Heading" value={b.heading} onChange={(e) => updateBanner(i, "heading", e.target.value)} className="input" />
                  <input placeholder="CTA text" value={b.ctaText} onChange={(e) => updateBanner(i, "ctaText", e.target.value)} className="input" />
                </div>
                <input placeholder="Subheading" value={b.subheading} onChange={(e) => updateBanner(i, "subheading", e.target.value)} className="input mt-4" />
                <input placeholder="CTA link (e.g. /products)" value={b.ctaLink} onChange={(e) => updateBanner(i, "ctaLink", e.target.value)} className="input mt-4" />
              </div>
            ))}
            {(!form.heroBanners || form.heroBanners.length === 0) && (
              <p className="text-sm text-espresso/40">No banners added. The homepage will show a default hero.</p>
            )}
          </div>
        </section>

        {/* About page images */}
        <section className="bg-ivory border border-espresso/10 p-7">
          <h2 className="font-display text-lg text-espresso mb-2">About Page Images</h2>
          <p className="text-sm text-espresso/50 mb-5">
            The About page uses exactly two images. Upload the first (a factory / manufacturing shot) — it's shown
            large in the Manufacturing section. Upload the second (a quality inspection, finished-product or team
            shot) — it's shown smaller in the Quality Control section. Leave empty to show a placeholder.
          </p>
          <ImageUploader
            multiple
            max={2}
            value={form.aboutImages}
            onChange={(imgs) => set("aboutImages", imgs)}
            folder="about"
          />
        </section>

        {/* About page video */}
        <section className="bg-ivory border border-espresso/10 p-7">
          <h2 className="font-display text-lg text-espresso mb-2">About Page Video</h2>
          <p className="text-sm text-espresso/50 mb-5">
            Optional. Upload a short video (MP4, WebM or MOV) to show in the Quality Control section instead of the
            second image above. It plays muted, looped and without controls. Leave empty to keep showing the image.
          </p>
          <ImageUploader
            value={form.aboutVideo}
            onChange={(video) => set("aboutVideo", video)}
            folder="about"
            allowVideo
          />
        </section>

        {/* SEO */}
        <section className="bg-ivory border border-espresso/10 p-7">
          <h2 className="font-display text-lg text-espresso mb-5">SEO Defaults</h2>
          <input placeholder="Default SEO title" value={form.seoTitle} onChange={(e) => set("seoTitle", e.target.value)} className="input mb-4" />
          <textarea placeholder="Default SEO description" rows={3} value={form.seoDescription} onChange={(e) => set("seoDescription", e.target.value)} className="input resize-none mb-4" />
          <input placeholder="SEO keywords (comma separated)" value={form.seoKeywords} onChange={(e) => set("seoKeywords", e.target.value)} className="input" />
        </section>

        {/* Misc */}
        <section className="bg-ivory border border-espresso/10 p-7">
          <h2 className="font-display text-lg text-espresso mb-5">Wholesale Note</h2>
          <textarea placeholder="Minimum order note shown in footer" rows={2} value={form.minOrderNote} onChange={(e) => set("minOrderNote", e.target.value)} className="input resize-none" />
        </section>

        <button type="submit" disabled={saving} className="btn-primary disabled:opacity-60">
          {saving ? "Saving..." : "Save All Settings"}
        </button>
      </form>
    </div>
  );
};

export default AdminSettings;
