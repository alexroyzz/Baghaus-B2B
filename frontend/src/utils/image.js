// Public Cloudinary uploads negotiate AVIF/WebP automatically and use
// Cloudinary's quality optimizer. Other image hosts keep their original URL.
const cloudinaryTransform = (url, { width, height, crop = "fill" } = {}) => {
  if (!url?.includes("res.cloudinary.com/") || !url.includes("/image/upload/")) return url;

  const transforms = ["f_auto", "q_auto"];
  if (width) transforms.push(`w_${Math.round(width)}`);
  if (height) transforms.push(`h_${Math.round(height)}`);
  if (width && height) transforms.push(`c_${crop}`, "g_auto");
  return url.replace("/image/upload/", `/image/upload/${transforms.join(",")}/`);
};

export const getImageUrl = (image, options = {}) => {
  if (!image) return "";
  const url = typeof image === "string" ? image : image.url || "";
  return cloudinaryTransform(url, options);
};

export const getResponsiveImage = (
  image,
  { width = 800, height = 1000, sizes = "(min-width: 1024px) 25vw, 50vw", crop = "fill" } = {}
) => {
  const src = getImageUrl(image, { width, height, crop });
  const isCloudinary = src.includes("res.cloudinary.com/") && src.includes("/image/upload/");
  if (!isCloudinary) return { src, srcSet: undefined, sizes: undefined };

  const aspectRatio = width / height;
  const candidates = [...new Set([320, 480, 640, 800, 960, 1200, width])]
    .filter((candidate) => candidate <= Math.max(width, 1200))
    .sort((a, b) => a - b);
  const srcSet = candidates
    .map((candidate) => `${getImageUrl(image, { width: candidate, height: candidate / aspectRatio, crop })} ${candidate}w`)
    .join(", ");
  return { src, srcSet, sizes };
};
