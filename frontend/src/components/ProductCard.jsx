import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { getImageUrl } from "../utils/image";

const placeholderImg =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='600' height='700'%3E%3Crect width='100%25' height='100%25' fill='%23EFE8DA'/%3E%3C/svg%3E";

const ProductCard = ({ product, index = 0 }) => {
  const img = getImageUrl(product.images?.[0]) || placeholderImg;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, delay: (index % 4) * 0.06 }}
      className="group"
    >
      <Link
        to={`/products/${product.slug}`}
        className="block transition-transform duration-300 ease-out hover:-translate-y-1"
      >
        <div className="img-frame relative aspect-[4/5]">
          <img
            src={img}
            alt={product.name}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          {product.featured && (
            <span className="absolute top-3 left-3 bg-espresso text-ivory text-[10px] tracking-widest2 uppercase px-3 py-1.5 rounded-lg shadow-sm">
              Bestseller
            </span>
          )}
        </div>

        <div className="pt-4 px-0.5">
          <p className="text-[11px] tracking-widest2 uppercase text-camel mb-1.5">
            {product.category?.name || "BagHaus"}
          </p>
          <h3 className="font-display text-lg text-espresso group-hover:text-camel transition-colors">
            {product.name}
          </h3>
          <div className="mt-2 flex items-center justify-between text-xs text-espresso/55">
            <span>MOQ {product.moq || 50}+ units</span>
            {product.priceRange && <span>{product.priceRange}</span>}
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default ProductCard;
