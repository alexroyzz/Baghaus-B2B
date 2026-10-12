import { useCallback, useEffect, useState } from "react";
import { FiEdit2, FiPlus, FiTrash2, FiX } from "react-icons/fi";
import toast from "react-hot-toast";
import api from "../../api/axios";
import Loader from "../../components/Loader";
import ImageUploader from "./ImageUploader";

const blank = { customerName: "", reviewText: "", rating: 5, photo: null, published: true, displayOrder: 0 };
const AdminTestimonials = () => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modal, setModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(blank);
  const [saving, setSaving] = useState(false);
  const load = useCallback(async () => {
    setLoading(true); setError("");
    try { const res = await api.get("/testimonials/manage"); setRows(res.data.data || []); }
    catch (err) { setError(err.response?.data?.message || "Could not load testimonials."); }
    finally { setLoading(false); }
  }, []);
  useEffect(() => { load(); }, [load]);

  const cleanupPhoto = async (photo, original) => {
    if (photo?.public_id && photo.public_id !== original?.public_id) {
      try { await api.post("/upload/delete", { public_id: photo.public_id, resource_type: "image" }); } catch { /* best-effort orphan cleanup */ }
    }
  };
  const openCreate = () => { setEditingId(null); setForm({ ...blank }); setModal(true); };
  const openEdit = (row) => { setEditingId(row._id); setForm({ customerName: row.customerName, reviewText: row.reviewText, rating: row.rating, photo: row.photo || null, published: row.published, displayOrder: row.displayOrder }); setModal(true); };
  const closeModal = async () => {
    await cleanupPhoto(form.photo, editingId ? rows.find((r) => r._id === editingId)?.photo : null);
    setModal(false);
  };
  const changePhoto = async (photo) => {
    await cleanupPhoto(form.photo, editingId ? rows.find((r) => r._id === editingId)?.photo : null);
    setForm((f) => ({ ...f, photo }));
  };
  const submit = async (event) => {
    event.preventDefault();
    const payload = { ...form, customerName: form.customerName.trim(), reviewText: form.reviewText.trim(), displayOrder: Number(form.displayOrder), rating: Number(form.rating) };
    if (payload.customerName.length < 2 || payload.customerName.length > 80) return toast.error("Name must be 2 to 80 characters.");
    if (payload.reviewText.length < 3 || payload.reviewText.length > 1000) return toast.error("Review must be 3 to 1000 characters.");
    if (!Number.isInteger(payload.rating) || payload.rating < 1 || payload.rating > 5) return toast.error("Choose a rating from 1 to 5.");
    if (!Number.isInteger(payload.displayOrder) || payload.displayOrder < 0 || payload.displayOrder > 1000000) return toast.error("Display order must be a whole number from 0 to 1000000.");
    setSaving(true);
    try {
      if (editingId) { await api.put(`/testimonials/${editingId}`, payload); toast.success("Testimonial updated."); }
      else { await api.post("/testimonials", payload); toast.success("Testimonial created."); }
      setModal(false); await load();
    } catch (err) { toast.error(err.response?.data?.message || "Could not save testimonial."); }
    finally { setSaving(false); }
  };
  const toggle = async (row) => {
    try { await api.put(`/testimonials/${row._id}`, { published: !row.published }); toast.success(row.published ? "Testimonial unpublished." : "Testimonial published."); await load(); }
    catch (err) { toast.error(err.response?.data?.message || "Could not update status."); }
  };
  const remove = async (row) => {
    if (!window.confirm(`Delete the testimonial from ${row.customerName}? This cannot be undone.`)) return;
    try { await api.delete(`/testimonials/${row._id}`); toast.success("Testimonial deleted."); await load(); }
    catch (err) { toast.error(err.response?.data?.message || "Could not delete testimonial."); }
  };

  return <section>
    <div className="flex flex-wrap items-center justify-between gap-4 mb-7">
      <div><h1 className="font-display text-3xl text-espresso">Testimonials Management</h1><p className="text-sm text-espresso/50 mt-1">Manage customer reviews shown on the website.</p></div>
      <button onClick={openCreate} className="btn-primary !py-2.5"><FiPlus /> Add testimonial</button>
    </div>
    {loading ? <Loader label="Loading testimonials" /> : error ? <div className="bg-red-50 border border-red-200 p-5 text-red-800 text-sm">{error}<button onClick={load} className="underline ml-3">Retry</button></div> : rows.length === 0 ? <div className="bg-ivory border border-espresso/10 p-10 text-center text-espresso/50">No testimonials yet. Add the first review to show it on the homepage.</div> :
      <div className="bg-ivory border border-espresso/10 overflow-x-auto"><table className="w-full min-w-[720px] text-sm"><thead><tr className="text-left text-[11px] uppercase tracking-wide text-espresso/40 border-b border-espresso/10"><th className="px-5 py-3">Customer</th><th className="px-5 py-3">Review</th><th className="px-5 py-3">Rating</th><th className="px-5 py-3">Order</th><th className="px-5 py-3">Status</th><th className="px-5 py-3 text-right">Actions</th></tr></thead><tbody>
        {rows.map((row) => <tr key={row._id} className="border-b border-espresso/5 last:border-0"><td className="px-5 py-4 font-medium text-espresso">{row.customerName}</td><td className="px-5 py-4 max-w-sm text-espresso/60"><span className="line-clamp-2">{row.reviewText}</span></td><td className="px-5 py-4 text-camel">{"★".repeat(row.rating)}<span className="text-espresso/15">{"★".repeat(5-row.rating)}</span></td><td className="px-5 py-4">{row.displayOrder}</td><td className="px-5 py-4"><button onClick={() => toggle(row)} className={`rounded-full px-3 py-1 text-xs ${row.published ? "bg-green-100 text-green-800" : "bg-espresso/10 text-espresso/55"}`}>{row.published ? "Published" : "Unpublished"}</button></td><td className="px-5 py-4"><div className="flex justify-end gap-2"><button aria-label={`Edit ${row.customerName}`} onClick={() => openEdit(row)} className="p-2 text-espresso/50 hover:text-camel"><FiEdit2 /></button><button aria-label={`Delete ${row.customerName}`} onClick={() => remove(row)} className="p-2 text-espresso/50 hover:text-red-600"><FiTrash2 /></button></div></td></tr>)}
      </tbody></table></div>}

    {modal && <div className="fixed inset-0 z-50 bg-black/45 flex items-center justify-center p-4" onMouseDown={(e) => e.target === e.currentTarget && closeModal()}><div role="dialog" aria-modal="true" aria-labelledby="testimonial-form-title" className="bg-ivory w-full max-w-2xl max-h-[92vh] overflow-y-auto shadow-xl">
      <div className="sticky top-0 bg-ivory border-b border-espresso/10 px-6 py-4 flex justify-between items-center"><h2 id="testimonial-form-title" className="font-display text-2xl">{editingId ? "Edit testimonial" : "Add testimonial"}</h2><button aria-label="Close" onClick={closeModal}><FiX /></button></div>
      <form onSubmit={submit} className="p-6 space-y-4">
        <label className="block text-sm">Customer name *<input required minLength={2} maxLength={80} value={form.customerName} onChange={(e) => setForm({ ...form, customerName: e.target.value })} className="mt-1 w-full border border-espresso/20 bg-white px-3 py-2" /></label>
        <label className="block text-sm">Review text *<textarea required minLength={3} maxLength={1000} rows={4} value={form.reviewText} onChange={(e) => setForm({ ...form, reviewText: e.target.value })} className="mt-1 w-full border border-espresso/20 bg-white px-3 py-2" /></label>
        <div className="grid sm:grid-cols-2 gap-4"><label className="block text-sm">Star rating<select value={form.rating} onChange={(e) => setForm({ ...form, rating: Number(e.target.value) })} className="mt-1 w-full border border-espresso/20 bg-white px-3 py-2">{[1,2,3,4,5].map((v) => <option key={v} value={v}>{v} {v === 1 ? "star" : "stars"}</option>)}</select></label><label className="block text-sm">Display order<input type="number" min="0" max="1000000" step="1" value={form.displayOrder} onChange={(e) => setForm({ ...form, displayOrder: e.target.value })} className="mt-1 w-full border border-espresso/20 bg-white px-3 py-2" /></label></div>
        <div><p className="text-sm mb-2">Customer photo <span className="text-espresso/40">(optional)</span></p><ImageUploader value={form.photo} onChange={changePhoto} folder="testimonials" deleteOnRemove={false} /></div>
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.published} onChange={(e) => setForm({ ...form, published: e.target.checked })} /> Published on website</label>
        <div className="pt-3 flex justify-end gap-3"><button type="button" disabled={saving} onClick={closeModal} className="px-4 py-2 border border-espresso/20">Cancel</button><button disabled={saving} className="btn-primary !py-2.5">{saving ? "Saving…" : editingId ? "Save changes" : "Add testimonial"}</button></div>
      </form>
    </div></div>}
  </section>;
};
export default AdminTestimonials;
