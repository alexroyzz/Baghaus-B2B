import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiArrowLeft, FiArrowUpRight } from "react-icons/fi";
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

  if (loading) return <Loader label="Loading product" />;
  if (!product)
    return (
      <div className="section container-max py-24 text-center">
        <p className="text-espresso/60 mb-6">Product not found.</p>
        <Link to="/products" className="btn-outline">
          Back to Products
        </Link>
      </div>
    );

  const images = product.images?.length ? product.images.map(getImageUrl) : [placeholderImg];
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

  return (
    <>
      <SEO title={product.name} description={product.shortDescription} image={images[0]} />

      <section className="section container-max pt-8 pb-12">
        <Link to="/products" className="inline-flex items-center gap-2 text-sm text-espresso/60 hover:text-camel mb-6">
          <FiArrowLeft /> Back to Products
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-12 items-start">
          {/* Gallery */}
          <div className="lg:sticky lg:top-24">
            <motion.div
              key={activeImg}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
              className="img-frame mb-3 mx-auto max-w-[440px] lg:max-w-none"
              style={{ height: "clamp(360px, 42vw, 520px)" }}
            >
              <img src={images[activeImg]} alt={product.name} className="h-full w-full object-cover" />
            </motion.div>
            {images.length > 1 && (
              <div className="flex gap-2.5 mx-auto max-w-[440px] lg:max-w-none">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImg(i)}
                    className={`h-16 w-[52px] overflow-hidden rounded-lg border-2 shrink-0 transition-colors ${
                      activeImg === i ? "border-camel" : "border-transparent"
                    }`}
                  >
                    <img src={img} alt="" className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div>
            <p className="eyebrow mb-2">{product.category?.name}</p>
            <h1 className="font-display text-3xl sm:text-4xl text-espresso mb-3">{product.name}</h1>
            {product.shortDescription && (
              <p className="text-sm text-espresso/60 mb-5 leading-relaxed">{product.shortDescription}</p>
            )}

            <div className="flex flex-wrap gap-3 mb-6">
              <button onClick={() => setQuoteOpen(true)} className="btn-primary flex-1 sm:flex-none justify-center">
                Request Quote
              </button>
              <WhatsAppButton productName={product.name} />
              <CallButton />
            </div>

            <div className="border border-espresso/15 spec-tag shadow-card p-5 sm:p-6 mb-6">
              <p className="text-[11px] tracking-widest2 uppercase text-camel mb-3">Specification Sheet</p>
              <dl className="grid grid-cols-2 gap-x-5 gap-y-3">
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
        <section className="bg-bone py-14">
          <div className="section container-max">
            <div className="flex items-end justify-between mb-8 flex-wrap gap-4">
              <div>
                <p className="eyebrow mb-2">You May Also Like</p>
                <h2 className="font-display text-2xl sm:text-3xl text-espresso">Related Products</h2>
              </div>
              <Link
                to={`/products?category=${product.category?.slug || ""}`}
                className="btn-ghost"
              >
                View All <FiArrowUpRight />
              </Link>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {related.map((p, i) => (
                <ProductCard key={p._id} product={p} index={i} />
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
