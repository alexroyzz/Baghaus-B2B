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
  const [categoriesLoaded, setCategoriesLoaded] = useState(false);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [debouncedSearch, setDebouncedSearch] = useState(search);
  const activeCategory = searchParams.get("category") || "";

  useEffect(() => {
    const controller = new AbortController();
    api.get("/categories", { signal: controller.signal })
      .then((res) => setCategories(res.data.data || []))
      .catch((error) => {
        if (error.code !== "ERR_CANCELED") setCategories([]);
      })
      .finally(() => {
        if (!controller.signal.aborted) setCategoriesLoaded(true);
      });
    return () => controller.abort();
  }, []);

  // Keep the input in sync with links, browser back/forward, and shared URLs.
  useEffect(() => {
    setSearch(searchParams.get("search") || "");
  }, [searchParams]);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search.trim()), 300);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    if (!categoriesLoaded) return;
    const controller = new AbortController();
    setLoading(true);

    const params = new URLSearchParams({ limit: "24" });
    if (activeCategory) {
      const category = categories.find((item) => item.slug === activeCategory);
      if (!category) {
        setProducts([]);
        setLoading(false);
        return () => controller.abort();
      }
      params.set("category", category._id);
    }
    if (debouncedSearch) params.set("search", debouncedSearch);

    api.get(`/products?${params.toString()}`, { signal: controller.signal })
      .then((res) => setProducts(res.data.data || []))
      .catch((error) => {
        if (error.code !== "ERR_CANCELED") setProducts([]);
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, [activeCategory, debouncedSearch, categories, categoriesLoaded]);

  const handleCategoryClick = (slug) => {
    const next = new URLSearchParams(searchParams);
    const currentSearch = search.trim();
    if (currentSearch) next.set("search", currentSearch);
    else next.delete("search");
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
            {categories.map((category) => (
              <button
                key={category._id}
                onClick={() => handleCategoryClick(category.slug)}
                className={`rounded-xl px-4 py-2 text-xs tracking-widest2 uppercase border transition-colors duration-200 ${
                  activeCategory === category.slug
                    ? "bg-espresso text-ivory border-espresso"
                    : "border-espresso/20 text-espresso/70 hover:border-espresso"
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-64">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-espresso/40" size={16} />
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search products..."
              aria-label="Search products"
              autoComplete="off"
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
            {products.map((product, index) => (
              <ProductCard key={product._id} product={product} index={index} />
            ))}
          </div>
        )}
      </section>
    </>
  );
};

export default Products;
