import { useEffect, useState } from "react";
import { FiPlus, FiEdit2, FiTrash2, FiX } from "react-icons/fi";
import toast from "react-hot-toast";
import api from "../../api/axios";
import Loader from "../../components/Loader";
import ImageUploader from "./ImageUploader";

const emptyForm = { name: "", description: "", image: "", order: 0, active: true, seoTitle: "", seoDescription: "" };

const AdminCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const load = () => {
    setLoading(true);
    api
      .get("/categories?all=true")
      .then((res) => setCategories(res.data.data))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyForm);
    setModalOpen(true);
  };

  const openEdit = (cat) => {
    setEditingId(cat._id);
    setForm({ ...emptyForm, ...cat });
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingId) {
        await api.put(`/categories/${editingId}`, form);
        toast.success("Category updated.");
      } else {
        await api.post("/categories", form);
        toast.success("Category created.");
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
    if (!confirm("Delete this category? This cannot be undone.")) return;
    try {
      await api.delete(`/categories/${id}`);
      toast.success("Category deleted.");
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || "Delete failed.");
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display text-3xl text-espresso">Categories</h1>
        <button onClick={openCreate} className="btn-primary !py-2.5">
          <FiPlus /> New Category
        </button>
      </div>

      {loading ? (
        <Loader label="Loading categories" />
      ) : (
        <div className="bg-ivory border border-espresso/10">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-[11px] uppercase tracking-wide text-espresso/40 border-b border-espresso/10">
                <th className="px-6 py-3 font-medium">Name</th>
                <th className="px-6 py-3 font-medium">Slug</th>
                <th className="px-6 py-3 font-medium">Order</th>
                <th className="px-6 py-3 font-medium">Status</th>
                <th className="px-6 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((c) => (
                <tr key={c._id} className="border-b border-espresso/5 last:border-0">
                  <td className="px-6 py-3.5 text-espresso font-medium">{c.name}</td>
                  <td className="px-6 py-3.5 text-espresso/50">{c.slug}</td>
                  <td className="px-6 py-3.5 text-espresso/50">{c.order}</td>
                  <td className="px-6 py-3.5">
                    <span className={`text-xs px-2 py-1 ${c.active ? "bg-camel/15 text-camel" : "bg-espresso/10 text-espresso/50"}`}>
                      {c.active ? "Active" : "Hidden"}
                    </span>
                  </td>
                  <td className="px-6 py-3.5 text-right">
                    <button onClick={() => openEdit(c)} className="text-espresso/50 hover:text-camel mr-3">
                      <FiEdit2 size={15} />
                    </button>
                    <button onClick={() => handleDelete(c._id)} className="text-espresso/50 hover:text-rust">
                      <FiTrash2 size={15} />
                    </button>
                  </td>
                </tr>
              ))}
              {categories.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-10 text-center text-espresso/40">
                    No categories yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-espresso/60 backdrop-blur-sm px-6" onClick={() => setModalOpen(false)}>
          <div className="w-full max-w-lg bg-ivory p-8 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-xl text-espresso">{editingId ? "Edit Category" : "New Category"}</h2>
              <button onClick={() => setModalOpen(false)}>
                <FiX size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-[11px] uppercase tracking-widest2 text-espresso/50 mb-1.5 block">Image</label>
                <ImageUploader value={form.image} onChange={(img) => setForm({ ...form, image: img })} folder="categories" />
              </div>
              <input required placeholder="Category name*" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input" />
              <textarea placeholder="Description" rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="input resize-none" />
              <div className="grid grid-cols-2 gap-4">
                <input type="number" placeholder="Sort order" value={form.order} onChange={(e) => setForm({ ...form, order: Number(e.target.value) })} className="input" />
                <label className="flex items-center gap-2 text-sm text-espresso/70">
                  <input type="checkbox" checked={form.active} onChange={(e) => setForm({ ...form, active: e.target.checked })} />
                  Active (visible on site)
                </label>
              </div>
              <input placeholder="SEO title" value={form.seoTitle} onChange={(e) => setForm({ ...form, seoTitle: e.target.value })} className="input" />
              <textarea placeholder="SEO description" rows={2} value={form.seoDescription} onChange={(e) => setForm({ ...form, seoDescription: e.target.value })} className="input resize-none" />
              <button type="submit" disabled={saving} className="btn-primary w-full disabled:opacity-60">
                {saving ? "Saving..." : "Save Category"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCategories;
