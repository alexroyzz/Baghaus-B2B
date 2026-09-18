import express from "express";
import multer from "multer";
import { protect } from "../middleware/auth.js";
import { uploadBufferToCloudinary, deleteCloudinaryImage } from "../utils/cloudinary.js";

const router = express.Router();

// Images are received in memory only, then streamed straight to Cloudinary -
// nothing is ever written to local disk.
const storage = multer.memoryStorage();

const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/svg+xml"];
const ALLOWED_VIDEO_TYPES = ["video/mp4", "video/webm", "video/quicktime"];

const fileFilter = (req, file, cb) => {
  if (ALLOWED_IMAGE_TYPES.includes(file.mimetype) || ALLOWED_VIDEO_TYPES.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only image files (jpg, png, webp, gif, svg) or video files (mp4, webm, mov) are allowed."));
  }
};

const MAX_IMAGE_MB = Number(process.env.MAX_UPLOAD_MB) || 5;
const MAX_VIDEO_MB = Number(process.env.MAX_VIDEO_UPLOAD_MB) || 30;

const upload = multer({
  storage,
  fileFilter,
  // The multer-level ceiling has to cover the larger of the two (video); the
  // tighter image limit is enforced separately below, per file type.
  limits: { fileSize: Math.max(MAX_IMAGE_MB, MAX_VIDEO_MB) * 1024 * 1024 },
});

// Allowed logical folders so callers can organize assets (and so nothing
// arbitrary can be injected into the Cloudinary folder path).
const ALLOWED_FOLDERS = new Set([
  "products",
  "categories",
  "branding", // logo, favicon
  "hero-banners",
  "about", // About section image/video
  "assets", // general website/marketing assets
]);

// Admin only - upload a single image/video to Cloudinary, returns the secure URL + public_id
router.post("/", protect, upload.single("image"), async (req, res, next) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: "No file uploaded." });

    const isVideo = ALLOWED_VIDEO_TYPES.includes(req.file.mimetype);
    const maxBytes = (isVideo ? MAX_VIDEO_MB : MAX_IMAGE_MB) * 1024 * 1024;
    if (req.file.size > maxBytes) {
      return res.status(400).json({
        success: false,
        message: `File too large. Max size is ${isVideo ? MAX_VIDEO_MB : MAX_IMAGE_MB}MB for ${isVideo ? "videos" : "images"}.`,
      });
    }

    const folder = ALLOWED_FOLDERS.has(req.body.folder) ? req.body.folder : "assets";
    const resourceType = isVideo ? "video" : "image";
    const result = await uploadBufferToCloudinary(req.file.buffer, folder, resourceType);

    res.status(201).json({ success: true, url: result.url, public_id: result.public_id, resource_type: resourceType });
  } catch (err) {
    next(err);
  }
});

// Admin only - explicitly delete an image/video from Cloudinary (used when an
// admin removes media from a form before saving, so nothing is left orphaned).
router.post("/delete", protect, async (req, res, next) => {
  try {
    const { public_id, resource_type } = req.body;
    if (!public_id) return res.status(400).json({ success: false, message: "public_id is required." });
    await deleteCloudinaryImage(public_id, resource_type === "video" ? "video" : "image");
    res.json({ success: true, message: "Media deleted." });
  } catch (err) {
    next(err);
  }
});

export default router;
