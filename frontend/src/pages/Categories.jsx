import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import SEO from "../components/SEO";
import CategoryCard from "../components/CategoryCard";
import Loader from "../components/Loader";

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/categories")
      .then((res) => setCategories(res.data.data))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <SEO
        title="Wholesale Bag Categories"
        description="Browse Baghaus wholesale bag collections, including totes and other bag styles for retailers and businesses."
        canonicalPath="/categories"
      />

      <section className="section container-max pt-8 pb-6 sm:pt-12 sm:pb-8">
        <div className="section-heading">
          <p className="eyebrow">Collections</p>
          <h1 className="font-display text-3xl leading-tight text-espresso min-[375px]:text-4xl sm:text-5xl">Browse by Category</h1>
        </div>
      </section>

      <section className="section container-max pb-20">
        <h2 className="sr-only">Available bag categories</h2>
        {loading ? (
          <Loader label="Loading categories" />
        ) : categories.length === 0 ? (
          <div className="mx-auto max-w-xl py-16 text-center">
            <h2 className="font-display text-2xl text-espresso">No collections available right now</h2>
            <p className="mt-2 text-sm text-espresso/60">Contact our team for help finding the right wholesale bag.</p>
            <Link to="/contact" className="btn-primary mt-6">Contact Baghaus</Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-6 lg:grid-cols-4">
            {categories.map((category) => (
              <CategoryCard key={category._id} category={category} />
            ))}
          </div>
        )}
      </section>
    </>
  );
};

export default Categories;
