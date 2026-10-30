import { Helmet } from "react-helmet-async";
import { useLocation } from "react-router-dom";
import { useSettings } from "../context/SettingsContext";

const SITE_URL = "https://baghaus.in";

const SEO = ({
  title,
  exactTitle,
  description,
  image,
  canonicalPath,
  canonical = true,
  noindex = false,
  breadcrumbs = [],
  structuredData = [],
}) => {
  const { settings } = useSettings();
  const location = useLocation();
  const companyName = settings.companyName || "Baghaus";
  const finalTitle = exactTitle || (title ? `${title} | ${companyName}` : settings.seoTitle || companyName);
  const finalDescription = description || settings.seoDescription || "Wholesale bags for retailers, brands and businesses. Contact Baghaus to discuss bulk orders and custom requirements.";
  const requestedCanonicalPath = canonicalPath || location.pathname;
  const normalizedCanonicalPath = requestedCanonicalPath.length > 1
    ? requestedCanonicalPath.replace(/\/+$/, "")
    : requestedCanonicalPath;
  const canonicalUrl = canonical
    ? new URL(normalizedCanonicalPath, SITE_URL).href
    : null;
  const imageUrl = image && !image.startsWith("data:")
    ? new URL(image, SITE_URL).href
    : null;
  const schemas = [
    ...structuredData,
    ...(breadcrumbs.length
      ? [{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: breadcrumbs.map((breadcrumb, index) => ({
            "@type": "ListItem",
            position: index + 1,
            name: breadcrumb.name,
            item: new URL(breadcrumb.path, SITE_URL).href,
          })),
        }]
      : []),
  ];

  return (
    <Helmet>
      <title>{finalTitle}</title>
      <meta name="description" content={finalDescription} />
      <meta name="robots" content={noindex ? "noindex,follow" : "index,follow,max-image-preview:large"} />
      {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}
      <meta property="og:site_name" content={companyName} />
      <meta property="og:title" content={finalTitle} />
      <meta property="og:description" content={finalDescription} />
      <meta property="og:type" content="website" />
      {canonicalUrl && <meta property="og:url" content={canonicalUrl} />}
      {imageUrl && <meta property="og:image" content={imageUrl} />}
      <meta name="twitter:card" content={imageUrl ? "summary_large_image" : "summary"} />
      <meta name="twitter:title" content={finalTitle} />
      <meta name="twitter:description" content={finalDescription} />
      {imageUrl && <meta name="twitter:image" content={imageUrl} />}
      {schemas.map((schema, index) => (
        <script key={`${schema["@type"] || "schema"}-${index}`} type="application/ld+json">
          {JSON.stringify(schema).replace(/</g, "\\u003c")}
        </script>
      ))}
    </Helmet>
  );
};

export default SEO;
