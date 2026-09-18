import { useEffect, useState } from "react";
import { FiPlus, FiEdit2, FiTrash2, FiX } from "react-icons/fi";
import toast from "react-hot-toast";
import api from "../../api/axios";
import Loader from "../../components/Loader";
import ImageUploader from "./ImageUploader";
import { getImageUrl } from "../../utils/image";

const emptyForm = {
  name: "",
  sku: "",
  category: "",
  shortDescription: "",
  description: "",
  images: [],
  materials: "",
  colors: "",
  sizes: "",
  compartment: "",
  closureType: "",
  tags: "",
  moq: 50,
  priceRange: "",
  featured: false,
  active: true,
  seoTitle: "",
  seoDescription: "",
};

const toCsv = (arr) => (Array.isArray(arr) ? arr.join(", ") : "");
const fromCsv = (str) =>
  str
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const load = () => {
    setLoading(true);
    Promise.all([api.get("/products?all=true&limit=200"), api.get("/categories?all=true")])
      .then(([prodRes, catRes]) => {
        setProducts(prodRes.data.data);
        setCategories(catRes.data.data);
      })
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const openCreate = () => {
    setEditingId(null);
    setForm({ ...emptyForm, category: categories[0]?._id || "" });
    setModalOpen(true);
  };

  const openEdit = (p) => {
    setEditingId(p._id);
    setForm({
      ...emptyForm,
      ...p,
      category: p.category?._id || p.category,
      materials: toCsv(p.materials),
      colors: toCsv(p.colors),
      sizes: toCsv(p.sizes),
      tags: toCsv(p.tags),
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    const payload = {
      ...form,
      materials: fromCsv(form.materials),
      colors: fromCsv(form.colors),
      sizes: fromCsv(form.sizes),
      tags: fromCsv(form.tags),
      moq: Number(form.moq) || 0,
    };
    try {
      if (editingId) {
        await api.put(`/products/${editingId}`, payload);
        toast.success("Product updated.");
      } else {
        await api.post("/products", payload);
        toast.success("Product created.");
      }
      setModalOpen(false);
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || "Save failed.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this product? This cannot be undone.")) return;
    try {
      await api.delete(`/products/${id}`);
      toast.success("Product deleted.");
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || "Delete failed.");
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display text-3xl text-espresso">Products</h1>
        <button onClick={openCreate} disabled={!categories.length} className="btn-primary !py-2.5 disabled:opacity-50">
          <FiPlus /> New Product
        </button>
      </div>

      {!categories.length && !loading && (
        <p className="mb-6 text-sm text-rust">Create a category first before adding products.</p>
      )}

      {loading ? (
        <Loader label="Loading products" />
      ) : (
        <div className="bg-ivory border border-espresso/10">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-[11px] uppercase tracking-wide text-espresso/40 border-b border-espresso/10">
                <th className="px-6 py-3 font-medium">Product</th>
                <th className="px-6 py-3 font-medium">Category</th>
                <th className="px-6 py-3 font-medium">MOQ</th>
                <th className="px-6 py-3 font-medium">Featured</th>
                <th className="px-6 py-3 font-medium">Status</th>
                <th className="px-6 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p._id} className="border-b border-espresso/5 last:border-0">
                  <td className="px-6 py-3.5 flex items-center gap-3">
                    <div className="h-10 w-10 bg-bone overflow-hidden shrink-0">
                      {p.images?.[0] && <img src={getImageUrl(p.images[0])} alt="" className="h-full w-full object-cover" />}
                    </div>
                    <span className="text-espresso font-medium">{p.name}</span>
                  </td>
                  <td className="px-6 py-3.5 text-espresso/60">{p.category?.name}</td>
                  <td className="px-6 py-3.5 text-espresso/60">{p.moq}</td>
                  <td className="px-6 py-3.5">{p.featured ? "Yes" : "—"}</td>
                  <td className="px-6 py-3.5">
                    <span className={`text-xs px-2 py-1 ${p.active ? "bg-camel/15 text-camel" : "bg-espresso/10 text-espresso/50"}`}>
                      {p.active ? "Active" : "Hidden"}
                    </span>
                  </td>
                  <td className="px-6 py-3.5 text-right">
                    <button onClick={() => openEdit(p)} className="text-espresso/50 hover:text-camel mr-3">
                      <FiEdit2 size={15} />
                    </button>
                    <button onClick={() => handleDelete(p._id)} className="text-espresso/50 hover:text-rust">
                      <FiTrash2 size={15} />
                    </button>
                  </td>
                </tr>
              ))}
              {products.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center text-espresso/40">
                    No products yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-espresso/60 backdrop-blur-sm px-6 py-8" onClick={() => setModalOpen(false)}>
          <div className="w-full max-w-2xl bg-ivory p-8 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-xl text-espresso">{editingId ? "Edit Product" : "New Product"}</h2>
              <button onClick={() => setModalOpen(false)}>
                <FiX size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-[11px] uppercase tracking-widest2 text-espresso/50 mb-1.5 block">Images</label>
                <ImageUploader multiple value={form.images} onChange={(imgs) => setForm({ ...form, images: imgs })} folder="products" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input required placeholder="Product name*" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input" />
                <select required value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="input">
                  <option value="">Select category*</option>
                  {categories.map((c) => (
                    <option key={c._id} value={c._id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <input placeholder="SKU" value={form.sku} onChange={(e) => setForm({ ...form, sku: e.target.value })} className="input" />
                <input type="number" placeholder="MOQ" value={form.moq} onChange={(e) => setForm({ ...form, moq: e.target.value })} className="input" />
                <input placeholder="Price range e.g. $8-$14/unit" value={form.priceRange} onChange={(e) => setForm({ ...form, priceRange: e.target.value })} className="input" />
              </div>

              <input placeholder="Short description" value={form.shortDescription} onChange={(e) => setForm({ ...form, shortDescription: e.target.value })} className="input" />
              <textarea placeholder="Full description" rows={4} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="input resize-none" />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input placeholder="Materials (comma separated)" value={form.materials} onChange={(e) => setForm({ ...form, materials: e.target.value })} className="input" />
                <input placeholder="Colors (comma separated)" value={form.colors} onChange={(e) => setForm({ ...form, colors: e.target.value })} className="input" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input placeholder="Sizes (comma separated)" value={form.sizes} onChange={(e) => setForm({ ...form, sizes: e.target.value })} className="input" />
                <input placeholder="Tags (comma separated)" value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} className="input" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input placeholder="Compartment (e.g. Single / Multi-compartment)" value={form.compartment} onChange={(e) => setForm({ ...form, compartment: e.target.value })} className="input" />
                <input placeholder="Closure Type (e.g. Zipper, Magnetic Snap)" value={form.closureType} onChange={(e) => setForm({ ...form, closureType: e.target.value })} className="input" />
              </div>

              <div className="flex items-center gap-6">
                <label className="flex items-center gap-2 text-sm text-espresso/70">
                  <input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} />
                  Featured / Bestseller
                </label>
                <label className="flex items-center gap-2 text-sm text-espresso/70">
                  <input type="checkbox" checked={form.active} onChange={(e) => setForm({ ...form, active: e.target.checked })} />
                  Active (visible on site)
                </label>
              </div>

              <input placeholder="SEO title" value={form.seoTitle} onChange={(e) => setForm({ ...form, seoTitle: e.target.value })} className="input" />
              <textarea placeholder="SEO description" rows={2} value={form.seoDescription} onChange={(e) => setForm({ ...form, seoDescription: e.target.value })} className="input resize-none" />

              <button type="submit" disabled={saving} className="btn-primary w-full disabled:opacity-60">
                {saving ? "Saving..." : "Save Product"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;
