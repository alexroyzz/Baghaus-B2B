import Product from "../models/Product.js";
import { buildSitemapXml } from "../utils/sitemap.js";

export const getSitemap = async (req, res, next) => {
  try {
    const products = await Product.find({ active: true })
      .select("slug updatedAt")
      .lean();

    res
      .type("application/xml")
      .set("Cache-Control", "public, max-age=3600")
      .send(buildSitemapXml(products));
  } catch (error) {
    next(error);
  }
};
