import { Link } from "react-router-dom";
import { getResponsiveImage } from "../utils/image";

const placeholderImg =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='600' height='700'%3E%3Crect width='100%25' height='100%25' fill='%23EFE8DA'/%3E%3C/svg%3E";

const ProductCard = ({ product, variant = "default" }) => {
  const isFeaturedLayout = variant === "featured";
  const image = getResponsiveImage(product.images?.[0], {
    width: 800,
    height: 1000,
    sizes: isFeaturedLayout
      ? "(min-width: 1200px) 18vw, (min-width: 1024px) 22vw, (min-width: 768px) 30vw, 50vw"
      : "(min-width: 1024px) 22vw, (min-width: 640px) 45vw, 50vw",
  });
  const img = image.src || placeholderImg;
  const showBestseller = isFeaturedLayout
    ? product.bestseller === true || product.tags?.some(
        (tag) => tag.trim().toLowerCase() === "bestseller"
      )
    : product.featured;

  return (
    <article className="group flex h-full flex-col">
      <Link
        to={`/products/${product.slug}`}
        className="flex h-full flex-col rounded-card focus-visible:outline-offset-4"
      >
        <div
          className={`relative aspect-[4/5] overflow-hidden rounded-2xl bg-white shadow-card transition-shadow duration-300 ${
            isFeaturedLayout ? "p-3 sm:p-5 min-[1200px]:p-3" : "img-frame"
          }`}
        >
          <img
            src={img}
            srcSet={image.srcSet}
            sizes={image.sizes}
            alt={product.name}
            width="800"
            height="1000"
            loading="lazy"
            decoding="async"
            className={`h-full w-full transition-transform duration-300 group-hover:scale-[1.02] ${
              isFeaturedLayout ? "object-contain" : "object-cover"
            }`}
          />
          {showBestseller && (
            <span className="absolute left-3 top-3 rounded-full bg-espresso px-3 py-1.5 text-[9px] font-medium tracking-widest2 text-ivory shadow-sm sm:left-4 sm:top-4">
              Bestseller
            </span>
          )}
        </div>

        <div
          className={`flex flex-col px-0.5 pt-4 ${
            isFeaturedLayout ? "sm:pt-5" : ""
          }`}
        >
          <p className="mb-1.5 min-h-4 line-clamp-1 text-[10px] tracking-wider uppercase text-brass sm:text-[11px] sm:tracking-widest2">
            {product.category?.name || "BagHaus"}
          </p>
          <h3
            className={`line-clamp-2 font-display leading-6 text-espresso transition-colors group-hover:text-brass sm:text-lg sm:leading-7 ${
              isFeaturedLayout ? "text-base" : "text-lg"
            }`}
          >
            {product.name}
          </h3>
          <div className="mt-3 flex min-w-0 flex-wrap items-baseline justify-between gap-x-1.5 gap-y-0.5 text-[10px] text-espresso/65 min-[360px]:gap-x-2 min-[360px]:text-[11px] sm:text-xs">
            <span className="whitespace-nowrap">MOQ {product.moq || 50}+ units</span>
            {product.priceRange && <span className="whitespace-nowrap text-right">{product.priceRange}</span>}
          </div>
          {!isFeaturedLayout && (
            <span className="mt-3 inline-flex items-center whitespace-nowrap text-[11px] font-medium uppercase tracking-wider text-brass sm:text-xs sm:tracking-widest2">
              View product <span aria-hidden="true" className="ml-2 transition-transform group-hover:translate-x-1">→</span>
            </span>
          )}
        </div>
      </Link>
    </article>
  );
};

export default ProductCard;
