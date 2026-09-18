import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { getImageUrl } from "../utils/image";

const placeholderImg =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='600' height='700'%3E%3Crect width='100%25' height='100%25' fill='%23EFE8DA'/%3E%3C/svg%3E";

const CategoryCard = ({ category, index = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 24 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-60px" }}
    transition={{ duration: 0.5, delay: (index % 3) * 0.08 }}
  >
    <Link
      to={`/products?category=${category.slug}`}
      className="group block relative transition-transform duration-300 ease-out hover:-translate-y-1"
    >
      <div className="img-frame relative aspect-[4/5] sm:aspect-[5/6]">
        <img
          src={getImageUrl(category.image) || placeholderImg}
          alt={category.name}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-espresso/70 via-espresso/10 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-6">
          <h3 className="font-display text-xl sm:text-2xl text-ivory">{category.name}</h3>
          <p className="mt-1.5 text-xs tracking-widest2 uppercase text-ivory/70 group-hover:text-camel-light transition-colors">
            Explore Collection →
          </p>
        </div>
      </div>
    </Link>
  </motion.div>
);

export default CategoryCard;
