export const getImageUrl = (image) => {
  if (!image) return "";

  if (typeof image === "string") {
    return image;
  }

  if (typeof image === "object" && image.url) {
    return image.url;
  }

  return "";
};