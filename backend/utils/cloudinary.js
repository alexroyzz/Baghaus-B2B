import cloudinary from "../config/cloudinary.js";

// BagHaus keeps every uploaded asset organized under a single root folder,
// with sub-folders per asset type (products, categories, branding, hero-banners).
const ROOT_FOLDER = process.env.CLOUDINARY_FOLDER || "baghaus";

/**
 * Uploads an in-memory file buffer (from multer memoryStorage) to Cloudinary.
 * @param {Buffer} buffer - raw file buffer
 * @param {string} folder - sub-folder under the root BagHaus folder (e.g. "products")
 * @param {"image"|"video"} resourceType - Cloudinary resource type
 * @returns {Promise<{url: string, public_id: string}>}
 */
export const uploadBufferToCloudinary = (buffer, folder = "misc", resourceType = "image") => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: `${ROOT_FOLDER}/${folder}`,
        resource_type: resourceType,
        // Keep originals reasonably sized; Cloudinary will still serve responsive
        // transformations on request without altering the stored master asset.
        overwrite: true,
      },
      (error, result) => {
        if (error) return reject(error);
        resolve({ url: result.secure_url, public_id: result.public_id });
      }
    );
    stream.end(buffer);
  });
};

/**
 * Deletes a single Cloudinary asset by public_id. Safe to call with an empty/
 * missing public_id - it will simply resolve without contacting Cloudinary.
 * @param {string} public_id
 * @param {"image"|"video"} resourceType - must match the type the asset was uploaded as
 */
export const deleteCloudinaryImage = async (public_id, resourceType = "image") => {
  if (!public_id) return;
  try {
    await cloudinary.uploader.destroy(public_id, { resource_type: resourceType });
  } catch (err) {
    // Never let a cleanup failure break the primary request (e.g. a product
    // update/delete) - just log it for visibility.
    console.error(`Cloudinary delete failed for ${public_id}:`, err.message);
  }
};

/**
 * Deletes multiple Cloudinary assets (array of public_ids), ignoring falsy values.
 */
export const deleteCloudinaryImages = async (publicIds = []) => {
  const ids = (publicIds || []).filter(Boolean);
  await Promise.all(ids.map((id) => deleteCloudinaryImage(id)));
};

export default cloudinary;
