import test from "node:test";
import assert from "node:assert/strict";
import { buildSitemapXml } from "../utils/sitemap.js";
import { getSitemap } from "../controllers/seoController.js";
import { getProductBySlug } from "../controllers/productController.js";
import Product from "../models/Product.js";

const response = () => ({
  statusCode: 200,
  headers: {},
  status(code) { this.statusCode = code; return this; },
  type(value) { this.contentType = value; return this; },
  set(key, value) { this.headers[key] = value; return this; },
  json(value) { this.body = value; return this; },
  send(value) { this.body = value; return this; },
});

test("sitemap includes public pages and product URLs with valid lastmod values", () => {
  const xml = buildSitemapXml([
    { slug: "cotton-tote", updatedAt: "2026-10-28T12:00:00.000Z" },
    { slug: "", updatedAt: "invalid" },
  ]);

  assert.match(xml, /<loc>https:\/\/baghaus\.in\/terms-and-conditions<\/loc>/);
  assert.match(xml, /<loc>https:\/\/baghaus\.in\/products\/cotton-tote<\/loc><lastmod>2026-10-28T12:00:00\.000Z<\/lastmod>/);
  assert.doesNotMatch(xml, /\/products\/<\/loc>/);
});

test("sitemap endpoint queries only active products and returns XML", async () => {
  let filter;
  Product.find = (query) => {
    filter = query;
    return {
      select() {
        return { lean: async () => [{ slug: "active-tote", updatedAt: "2026-10-28T12:00:00.000Z" }] };
      },
    };
  };
  const res = response();
  await getSitemap({}, res, (error) => { throw error; });

  assert.deepEqual(filter, { active: true });
  assert.equal(res.contentType, "application/xml");
  assert.match(res.body, /\/products\/active-tote/);
  assert.match(res.headers["Cache-Control"], /max-age=3600/);
});

test("public product lookup excludes inactive products", async () => {
  let filter;
  Product.findOne = (query) => {
    filter = query;
    return {
      populate() { return this; },
      lean: async () => null,
    };
  };

  const res = response();
  await getProductBySlug({ params: { slug: "inactive-product" } }, res, (error) => {
    throw error;
  });

  assert.deepEqual(filter, { slug: "inactive-product", active: true });
  assert.equal(res.statusCode, 404);
  assert.equal(res.body.success, false);
});
