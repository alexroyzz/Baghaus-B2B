import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { FiSearch } from "react-icons/fi";
import api from "../api/axios";
import SEO from "../components/SEO";
import ProductCard from "../components/ProductCard";
import Loader from "../components/Loader";

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [categories, setCategories] = useState([]);
  const [categoriesLoaded, setCategoriesLoaded] = useState(false);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [debouncedSearch, setDebouncedSearch] = useState(search);
  const activeCategory = searchParams.get("category") || "";
  const requestedPage = Number.parseInt(searchParams.get("page") || "1", 10);
  const page = Number.isFinite(requestedPage) && requestedPage > 0 ? requestedPage : 1;
  const hasFilters = Boolean(activeCategory || searchParams.get("search"));

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
    const currentSearch = searchParams.get("search") || "";
    if (currentSearch === debouncedSearch) return;

    const next = new URLSearchParams(searchParams);
    if (debouncedSearch) next.set("search", debouncedSearch);
    else next.delete("search");
    next.delete("page");
    setSearchParams(next, { replace: true });
  }, [debouncedSearch, searchParams, setSearchParams]);

  useEffect(() => {
    if (!categoriesLoaded) return;
    const controller = new AbortController();
    setLoading(true);

    const params = new URLSearchParams({ limit: "24", page: String(page) });
    if (activeCategory) {
      const category = categories.find((item) => item.slug === activeCategory);
      if (!category) {
        setProducts([]);
        setPagination({ page: 1, pages: 1, total: 0 });
        setLoading(false);
        return () => controller.abort();
      }
      params.set("category", category._id);
    }
    if (debouncedSearch) params.set("search", debouncedSearch);

    api.get(`/products?${params.toString()}`, { signal: controller.signal })
      .then((res) => {
        setProducts(res.data.data || []);
        setPagination(res.data.pagination || { page, pages: 1, total: 0 });
      })
      .catch((error) => {
        if (error.code !== "ERR_CANCELED") {
          setProducts([]);
          setPagination({ page, pages: 1, total: 0 });
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, [activeCategory, debouncedSearch, categories, categoriesLoaded, page]);

  const handleCategoryClick = (slug) => {
    const next = new URLSearchParams(searchParams);
    const currentSearch = search.trim();
    if (currentSearch) next.set("search", currentSearch);
    else next.delete("search");
    next.delete("page");
    if (slug) next.set("category", slug);
    else next.delete("category");
    setSearchParams(next);
  };

  const getPageUrl = (requestedPageNumber) => {
    const next = new URLSearchParams(searchParams);
    const currentSearch = search.trim();
    if (currentSearch) next.set("search", currentSearch);
    else next.delete("search");
    if (requestedPageNumber > 1) next.set("page", String(requestedPageNumber));
    else next.delete("page");
    return `/products?${next.toString()}`;
  };

  return (
    <>
      <SEO
        title="Wholesale Bag Catalogue"
        description="Browse Baghaus wholesale bags for retailers and businesses. Explore the catalogue and contact our team to discuss bulk orders."
        canonicalPath={hasFilters ? "/products" : page > 1 ? `/products?page=${page}` : "/products"}
        noindex={hasFilters}
      />

      <section className="section container-max pt-8 pb-8 sm:pt-16 sm:pb-10">
        <div className="section-heading mb-5 sm:mb-6">
          <p className="eyebrow">Catalog</p>
          <h1 className="font-display text-3xl leading-tight text-espresso min-[375px]:text-4xl sm:text-5xl">Wholesale Bag Catalogue</h1>
        </div>

        <div className="flex min-w-0 flex-col gap-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
          <div className="bleed-x flex min-w-0 gap-2.5 overflow-x-auto overscroll-x-contain pb-2 sm:flex-1 sm:flex-wrap sm:overflow-visible sm:pb-0">
            <button
              type="button"
              aria-pressed={!activeCategory}
              onClick={() => handleCategoryClick("")}
              className={`min-h-10 shrink-0 whitespace-nowrap rounded-xl px-4 py-2 text-xs tracking-widest2 uppercase border transition-colors duration-200 ${
                !activeCategory ? "bg-espresso text-ivory border-espresso" : "border-espresso/20 text-espresso/70 hover:border-espresso"
              }`}
            >
              All
            </button>
            {categories.map((category) => (
              <button
                key={category._id}
                type="button"
                aria-pressed={activeCategory === category.slug}
                onClick={() => handleCategoryClick(category.slug)}
                className={`min-h-10 shrink-0 whitespace-nowrap rounded-xl px-4 py-2 text-xs tracking-widest2 uppercase border transition-colors duration-200 ${
                  activeCategory === category.slug
                    ? "bg-espresso text-ivory border-espresso"
                    : "border-espresso/20 text-espresso/70 hover:border-espresso"
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>

          <div className="relative w-full shrink-0 sm:w-64">
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

      <section className="section container-max pb-16 sm:pb-24">
        <h2 className="sr-only">Wholesale bag products</h2>
        {loading ? (
          <Loader label="Loading products" />
        ) : products.length === 0 ? (
          <div className="mx-auto max-w-xl py-16 text-center">
            <h2 className="font-display text-2xl text-espresso">No matching products</h2>
            <p className="mt-2 text-sm leading-relaxed text-espresso/60">
              Try another search or contact our team to discuss a custom or bulk bag requirement.
            </p>
            <Link to="/contact" className="btn-primary mt-6">Ask about a custom order</Link>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4 lg:gap-8">
              {products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
            {pagination.pages > 1 && (
              <nav aria-label="Product pagination" className="mt-10 flex items-center justify-center gap-6 text-sm">
                {page > 1 ? (
                  <Link to={getPageUrl(page - 1)} className="underline underline-offset-4 hover:text-camel">
                    Previous
                  </Link>
                ) : <span className="text-espresso/35">Previous</span>}
                <span aria-current="page">Page {page} of {pagination.pages}</span>
                {page < pagination.pages ? (
                  <Link to={getPageUrl(page + 1)} className="underline underline-offset-4 hover:text-camel">
                    Next
                  </Link>
                ) : <span className="text-espresso/35">Next</span>}
              </nav>
            )}
          </>
        )}
      </section>
    </>
  );
};

export default Products;
