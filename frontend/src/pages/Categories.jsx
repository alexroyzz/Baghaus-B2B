import { useEffect, useState } from "react";
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
      <SEO title="Categories" description="Explore BagHaus's wholesale bag categories — handbags, totes, backpacks, clutches and travel bags." />

      <section className="section container-max pt-12 pb-8">
        <p className="eyebrow mb-3">Collections</p>
        <h1 className="font-display text-4xl sm:text-5xl text-espresso">Browse by Category</h1>
      </section>

      <section className="section container-max pb-20">
        {loading ? (
          <Loader label="Loading categories" />
        ) : categories.length === 0 ? (
          <p className="text-center py-16 text-espresso/50">No categories available yet.</p>
        ) : (
          <div className="flex overflow-x-auto gap-4 pb-2 -mx-6 px-6 snap-x snap-mandatory scrollbar-hide sm:grid sm:grid-cols-3 lg:grid-cols-4 sm:gap-6 sm:overflow-visible sm:pb-0 sm:mx-0 sm:px-0">
            {categories.map((c, i) => (
              <div key={c._id} className="w-[42%] shrink-0 snap-start sm:w-auto">
                <CategoryCard category={c} index={i} />
              </div>
            ))}
          </div>
        )}
      </section>
    </>
  );
};

export default Categories;
