import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiArrowUpRight } from "react-icons/fi";
import api from "../api/axios";
import SEO from "../components/SEO";
import Loader from "../components/Loader";
import WhatsAppButton from "../components/WhatsAppButton";
import CallButton from "../components/CallButton";
import QuoteModal from "../components/QuoteModal";
import ProductCard from "../components/ProductCard";
import { getImageUrl } from "../utils/image";

const placeholderImg =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='900' height='1100'%3E%3Crect width='100%25' height='100%25' fill='%23EFE8DA'/%3E%3C/svg%3E";

const ProductDetail = () => {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImg, setActiveImg] = useState(0);
  const [quoteOpen, setQuoteOpen] = useState(false);
  const [related, setRelated] = useState([]);

  useEffect(() => {
    setLoading(true);
    api
      .get(`/products/${slug}`)
      .then((res) => {
        setProduct(res.data.data);
        setActiveImg(0);
      })
      .catch(() => setProduct(null))
      .finally(() => setLoading(false));
  }, [slug]);

  useEffect(() => {
    if (!product?.category?._id && !product?.category) return;
    const categoryId = product.category?._id || product.category;
    api
      .get("/products", { params: { category: categoryId, limit: 4 } })
      .then((res) => setRelated((res.data.data || []).filter((p) => p.slug !== product.slug).slice(0, 4)))
      .catch(() => setRelated([]));
  }, [product]);

  if (loading)
    return (
      <>
        <SEO
          title="Wholesale Bag Product"
          description="Browse Baghaus wholesale products and contact our team to discuss a bulk order."
          canonicalPath={`/products/${encodeURIComponent(slug || "")}`}
        />
        <Loader label="Loading product" />
      </>
    );
  if (!product)
    return (
      <>
        <SEO title="Product Not Found" noindex canonical={false} />
        <div className="section container-max py-24 text-center">
          <h1 className="font-display text-3xl text-espresso mb-4">Product not found</h1>
          <p className="text-espresso/60 mb-6">The product may be inactive or no longer available.</p>
          <Link to="/products" className="btn-outline">
            Back to Products
          </Link>
        </div>
      </>
    );

  const images = product.images?.length
    ? product.images.map((image) => getImageUrl(image, { width: 1100, height: 1375 }))
    : [placeholderImg];
  const specs = [
    ["Category", product.category?.name],
    ["MOQ", `${product.moq || 50} units`],
    ["Materials", product.materials?.join(", ")],
    ["Colors", product.colors?.join(", ")],
    ["Sizes", product.sizes?.join(", ")],
    ["Compartment", product.compartment],
    ["Closure Type", product.closureType],
    ["Price Range", product.priceRange],
    ["SKU", product.sku],
  ].filter(([, v]) => v);
  const productDescription = product.description || product.shortDescription || "";
  const productImages = product.images?.map((image) => getImageUrl(image)).filter(Boolean) || [];
  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    url: `https://baghaus.in/products/${encodeURIComponent(product.slug)}`,
    ...(productImages.length ? { image: productImages } : {}),
    ...(productDescription ? { description: productDescription } : {}),
    ...(product.sku ? { sku: product.sku } : {}),
    ...(product.category?.name ? { category: product.category.name } : {}),
    ...(product.materials?.length ? { material: product.materials.join(", ") } : {}),
    ...(product.colors?.length ? { color: product.colors.join(", ") } : {}),
    brand: { "@type": "Brand", name: "Baghaus" },
    ...(product.moq ? {
      additionalProperty: {
        "@type": "PropertyValue",
        name: "Minimum order quantity",
        value: product.moq,
        unitText: "units",
      },
    } : {}),
  };
  const breadcrumbs = [
    { name: "Home", path: "/" },
    { name: "Products", path: "/products" },
    ...(product.category?.name
      ? [{ name: product.category.name, path: `/products?category=${encodeURIComponent(product.category.slug || "")}` }]
      : []),
    { name: product.name, path: `/products/${encodeURIComponent(product.slug)}` },
  ];

  return (
    <>
      <SEO
        exactTitle={product.seoTitle || `${product.name} | Baghaus Wholesale`}
        description={product.seoDescription || productDescription || `${product.name} is available for wholesale enquiries from Baghaus. Contact our team to discuss a bulk order.`}
        image={images[0]}
        canonicalPath={`/products/${encodeURIComponent(product.slug)}`}
        breadcrumbs={breadcrumbs}
        structuredData={[productSchema]}
      />

      <section className="section container-max pt-6 pb-12 sm:pt-8">
        <nav aria-label="Breadcrumb" className="mb-6 text-sm text-espresso/60">
          <ol className="flex flex-wrap items-center gap-2">
            <li><Link to="/" className="hover:text-camel">Home</Link></li>
            <li aria-hidden="true">/</li>
            <li><Link to="/products" className="hover:text-camel">Products</Link></li>
            {product.category?.name && (
              <>
                <li aria-hidden="true">/</li>
                <li>
                  <Link to={`/products?category=${encodeURIComponent(product.category.slug || "")}`} className="hover:text-camel">
                    {product.category.name}
                  </Link>
                </li>
              </>
            )}
            <li aria-hidden="true">/</li>
            <li aria-current="page" className="min-w-0 break-words text-espresso">{product.name}</li>
          </ol>
        </nav>

        <div className="grid min-w-0 grid-cols-1 items-start gap-8 sm:gap-10 lg:grid-cols-2 lg:gap-12">
          {/* Gallery */}
          <div className="lg:sticky lg:top-24">
            <motion.div
              key={activeImg}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
              className="img-frame mb-3 mx-auto aspect-[4/5] w-full max-w-[440px] sm:max-w-[480px] lg:aspect-auto lg:h-[clamp(360px,42vw,520px)] lg:max-w-none"
            >
              <img
                src={images[activeImg]}
                alt={product.name}
                width="900"
                height="1125"
                fetchPriority="high"
                decoding="async"
                className="h-full w-full object-cover"
              />
            </motion.div>
            {images.length > 1 && (
              <div className="mx-auto flex max-w-[440px] gap-2.5 overflow-x-auto pb-1 sm:max-w-[480px] lg:max-w-none">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImg(i)}
                    aria-label={`View ${product.name} image ${i + 1}`}
                    className={`h-16 w-[52px] overflow-hidden rounded-lg border-2 shrink-0 transition-colors ${
                      activeImg === i ? "border-camel" : "border-transparent"
                    }`}
                  >
                    <img
                      src={getImageUrl(product.images[i], { width: 160, height: 200 }) || img}
                      alt=""
                      width="52"
                      height="64"
                      loading="lazy"
                      decoding="async"
                      className="h-full w-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div className="min-w-0">
            <p className="eyebrow mb-2">{product.category?.name}</p>
            <h1 className="font-display text-2xl leading-tight text-espresso mb-3 break-words min-[375px]:text-3xl sm:text-4xl">{product.name}</h1>
            {product.shortDescription && (
              <p className="text-sm text-espresso/60 mb-5 leading-relaxed break-words">{product.shortDescription}</p>
            )}

            <div className="cta-row mb-6">
              <button onClick={() => setQuoteOpen(true)} className="btn-primary">
                Request Quote
              </button>
              <WhatsAppButton productName={product.name} />
              <CallButton />
            </div>

            <div className="border border-espresso/15 spec-tag shadow-card p-5 sm:p-6 mb-6">
              <p className="text-[11px] tracking-widest2 uppercase text-camel mb-3">Specification Sheet</p>
              <dl className="grid grid-cols-1 gap-x-5 gap-y-3 min-[400px]:grid-cols-2">
                {specs.map(([label, value]) => (
                  <div key={label} className="min-w-0">
                    <dt className="text-[10px] uppercase tracking-wide text-espresso/40 mb-0.5">{label}</dt>
                    <dd className="text-sm text-espresso leading-snug break-words">{value}</dd>
                  </div>
                ))}
              </dl>
            </div>

            {product.description && (
              <div>
                <p className="text-[11px] tracking-widest2 uppercase text-camel mb-2">Details</p>
                <p className="text-sm text-espresso/65 leading-relaxed whitespace-pre-line">{product.description}</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <section className="bg-bone py-10 sm:py-14">
          <div className="section container-max">
            <div className="relative mb-8 flex flex-col gap-4 sm:block">
              <div className="section-heading">
                <p className="eyebrow">You May Also Like</p>
                <h2 className="font-display text-2xl sm:text-3xl text-espresso">Related Products</h2>
              </div>
              <Link
                to={`/products?category=${product.category?.slug || ""}`}
                className="btn-ghost self-start sm:absolute sm:bottom-0 sm:right-0"
              >
                View All <FiArrowUpRight />
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
              {related.map((p) => (
                <ProductCard key={p._id} product={p} />
              ))}
            </div>
          </div>
        </section>
      )}

      <QuoteModal open={quoteOpen} onClose={() => setQuoteOpen(false)} productName={product.name} productId={product._id} />
    </>
  );
};

export default ProductDetail;
