import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { FiSearch } from "react-icons/fi";
import api from "../api/axios";
import SEO from "../components/SEO";
import ProductCard from "../components/ProductCard";
import Loader from "../components/Loader";

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(searchParams.get("search") || "");

  const activeCategory = searchParams.get("category") || "";

  useEffect(() => {
    api.get("/categories").then((res) => setCategories(res.data.data));
  }, []);

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (activeCategory) params.set("category", activeCategory);
    if (search) params.set("search", search);
    params.set("limit", "24");

    // category filter needs an id, so resolve slug -> id once categories load
    const load = async () => {
      let categoryId = "";
      if (activeCategory && categories.length) {
        const match = categories.find((c) => c.slug === activeCategory);
        categoryId = match?._id || "";
        if (categoryId) params.set("category", categoryId);
      } else {
        params.delete("category");
      }
      const res = await api.get(`/products?${params.toString()}`);
      setProducts(res.data.data);
      setLoading(false);
    };
    load();
  }, [activeCategory, search, categories]);

  const handleCategoryClick = (slug) => {
    const next = new URLSearchParams(searchParams);
    if (slug) next.set("category", slug);
    else next.delete("category");
    setSearchParams(next);
  };

  return (
    <>
      <SEO title="Wholesale Bag Products" description="Browse BagHaus's full wholesale catalog of handbags, totes, backpacks and more." />

      <section className="section container-max pt-16 pb-10">
        <p className="eyebrow mb-3">Catalog</p>
        <h1 className="font-display text-4xl sm:text-5xl text-espresso mb-6">All Products</h1>

        <div className="flex flex-col sm:flex-row gap-6 sm:items-center sm:justify-between">
          <div className="flex flex-wrap gap-2.5">
            <button
              onClick={() => handleCategoryClick("")}
              className={`rounded-xl px-4 py-2 text-xs tracking-widest2 uppercase border transition-colors duration-200 ${
                !activeCategory ? "bg-espresso text-ivory border-espresso" : "border-espresso/20 text-espresso/70 hover:border-espresso"
              }`}
            >
              All
            </button>
            {categories.map((c) => (
              <button
                key={c._id}
                onClick={() => handleCategoryClick(c.slug)}
                className={`rounded-xl px-4 py-2 text-xs tracking-widest2 uppercase border transition-colors duration-200 ${
                  activeCategory === c.slug
                    ? "bg-espresso text-ivory border-espresso"
                    : "border-espresso/20 text-espresso/70 hover:border-espresso"
                }`}
              >
                {c.name}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-64">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-espresso/40" size={16} />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products..."
              className="input !pl-9"
            />
          </div>
        </div>
      </section>

      <section className="section container-max pb-24">
        {loading ? (
          <Loader label="Loading products" />
        ) : products.length === 0 ? (
          <p className="text-center py-16 text-espresso/50">No products match your filters yet.</p>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {products.map((p, i) => (
              <ProductCard key={p._id} product={p} index={i} />
            ))}
          </div>
        )}
      </section>
    </>
  );
};

export default Products;
