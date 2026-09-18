import { Helmet } from "react-helmet-async";
import { useSettings } from "../context/SettingsContext";

const SEO = ({ title, description, image }) => {
  const { settings } = useSettings();
  const finalTitle = title ? `${title} | ${settings.companyName || "BagHaus"}` : settings.seoTitle;
  const finalDesc = description || settings.seoDescription;

  return (
    <Helmet>
      <title>{finalTitle}</title>
      <meta name="description" content={finalDesc} />
      <meta property="og:title" content={finalTitle} />
      <meta property="og:description" content={finalDesc} />
      <meta property="og:type" content="website" />
      {image && <meta property="og:image" content={image} />}
      <meta name="twitter:card" content="summary_large_image" />
    </Helmet>
  );
};

export default SEO;
