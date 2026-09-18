// Images are stored in MongoDB as Cloudinary { url, public_id } objects.
// This helper safely extracts a displayable URL from that shape (and still
// tolerates a plain string, in case of any legacy data).
export const getImageUrl = (image) => {
  if (!image) return "";
  if (typeof image === "string") return image;
  return image.url || "";
};
