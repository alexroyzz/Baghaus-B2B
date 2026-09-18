import Settings from "../models/Settings.js";
import { deleteCloudinaryImages, deleteCloudinaryImage } from "../utils/cloudinary.js";

const getOrCreateSettings = async () => {
  let settings = await Settings.findOne({ key: "site_settings" });
  if (!settings) settings = await Settings.create({ key: "site_settings" });
  return settings;
};

// Public - fetch site settings (for frontend to render logo, contact, socials etc.)
export const getSettings = async (req, res, next) => {
  try {
    const settings = await getOrCreateSettings();
    res.json({ success: true, data: settings });
  } catch (err) {
    next(err);
  }
};

// Admin - update settings
export const updateSettings = async (req, res, next) => {
  try {
    const settings = await getOrCreateSettings();

    // Collect public_ids currently on record before they get overwritten, so
    // any that are replaced or cleared can be removed from Cloudinary after save.
    const oldLogoId = settings.logo?.public_id;
    const oldFaviconId = settings.favicon?.public_id;
    const oldBannerIds = (settings.heroBanners || []).map((b) => b.image?.public_id).filter(Boolean);
    const oldAboutImageIds = (settings.aboutImages || []).map((img) => img?.public_id).filter(Boolean);
    const oldAboutVideoId = settings.aboutVideo?.public_id;

    Object.assign(settings, req.body);
    await settings.save();

    const newLogoId = settings.logo?.public_id;
    const newFaviconId = settings.favicon?.public_id;
    const newBannerIds = new Set((settings.heroBanners || []).map((b) => b.image?.public_id).filter(Boolean));
    const newAboutImageIds = new Set((settings.aboutImages || []).map((img) => img?.public_id).filter(Boolean));
    const newAboutVideoId = settings.aboutVideo?.public_id;

    const toDelete = [];
    if (oldLogoId && oldLogoId !== newLogoId) toDelete.push(oldLogoId);
    if (oldFaviconId && oldFaviconId !== newFaviconId) toDelete.push(oldFaviconId);
    oldBannerIds.forEach((id) => {
      if (!newBannerIds.has(id)) toDelete.push(id);
    });
    oldAboutImageIds.forEach((id) => {
      if (!newAboutImageIds.has(id)) toDelete.push(id);
    });

    if (toDelete.length) await deleteCloudinaryImages(toDelete);

    // The About video is a separate Cloudinary resource_type ("video"), so it
    // is deleted independently from the image cleanup batch above, which only
    // ever targets resource_type "image".
    if (oldAboutVideoId && oldAboutVideoId !== newAboutVideoId) {
      await deleteCloudinaryImage(oldAboutVideoId, "video");
    }

    res.json({ success: true, data: settings });
  } catch (err) {
    next(err);
  }
};
