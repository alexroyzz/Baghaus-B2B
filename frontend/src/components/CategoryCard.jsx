import { Link } from "react-router-dom";
import { getResponsiveImage } from "../utils/image";

const placeholderImg =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='600' height='700'%3E%3Crect width='100%25' height='100%25' fill='%23EFE8DA'/%3E%3C/svg%3E";

const CategoryCard = ({ category }) => {
  const image = getResponsiveImage(category.image, {
    width: 700,
    height: 875,
    sizes: "(min-width: 1024px) 18vw, (min-width: 640px) 30vw, 42vw",
  });

  return (
    <Link
      to={`/products?category=${category.slug}`}
      className="group block rounded-card focus-visible:outline-offset-4"
    >
      <div className="img-frame relative aspect-[4/5] transition-shadow duration-300 sm:aspect-[5/6]">
        <img
          src={image.src || placeholderImg}
          srcSet={image.srcSet}
          sizes={image.sizes}
          alt={category.name}
          width="700"
          height="875"
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-espresso/70 via-espresso/10 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-3.5 min-[480px]:p-5 sm:p-6">
          <h3 className="font-display text-lg leading-tight text-ivory min-[480px]:text-xl sm:text-2xl">{category.name}</h3>
          <p className="mt-1.5 whitespace-nowrap text-[10px] tracking-wider uppercase text-ivory/85 transition-colors group-hover:text-ivory min-[480px]:text-xs sm:tracking-widest2">
            Explore<span className="hidden min-[480px]:inline"> collection</span> <span aria-hidden="true">→</span>
          </p>
        </div>
      </div>
    </Link>
  );
};

export default CategoryCard;
