const STATIC_PATHS = [
  "/",
  "/about",
  "/products",
  "/categories",
  "/contact",
  "/privacy",
  "/terms-and-conditions",
];

const escapeXml = (value) => String(value)
  .replaceAll("&", "&amp;")
  .replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;")
  .replaceAll('"', "&quot;")
  .replaceAll("'", "&apos;");

export const buildSitemapXml = (products, siteUrl = "https://baghaus.in") => {
  const baseUrl = siteUrl.replace(/\/+$/, "");
  const staticUrls = STATIC_PATHS.map((pathname) => `${baseUrl}${pathname}`);
  const productUrls = products
    .filter((product) => typeof product.slug === "string" && product.slug.length > 0)
    .map((product) => ({
      url: `${baseUrl}/products/${encodeURIComponent(product.slug)}`,
      lastmod: product.updatedAt && !Number.isNaN(new Date(product.updatedAt).getTime())
        ? new Date(product.updatedAt).toISOString()
        : null,
    }));
  const entries = [
    ...staticUrls.map((url) => ({ url, lastmod: null })),
    ...productUrls,
  ];

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...entries.map(({ url, lastmod }) =>
      `  <url><loc>${escapeXml(url)}</loc>${lastmod ? `<lastmod>${lastmod}</lastmod>` : ""}</url>`
    ),
    "</urlset>",
  ].join("\n");
};
