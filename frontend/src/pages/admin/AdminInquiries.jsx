import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { FiTrash2, FiX } from "react-icons/fi";
import toast from "react-hot-toast";
import api from "../../api/axios";
import Loader from "../../components/Loader";

const statusOptions = ["new", "contacted", "in-progress", "closed"];

const AdminInquiries = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const statusFilter = searchParams.get("status") || "";

  const load = () => {
    setLoading(true);
    const params = statusFilter ? `?status=${statusFilter}&limit=100` : "?limit=100";
    api
      .get(`/inquiries${params}`)
      .then((res) => setInquiries(res.data.data))
      .finally(() => setLoading(false));
  };

  useEffect(load, [statusFilter]);

  const updateStatus = async (id, status) => {
    try {
      await api.put(`/inquiries/${id}`, { status });
      toast.success("Status updated.");
      load();
      if (selected?._id === id) setSelected({ ...selected, status });
    } catch {
      toast.error("Update failed.");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this inquiry?")) return;
    try {
      await api.delete(`/inquiries/${id}`);
      toast.success("Inquiry deleted.");
      setSelected(null);
      load();
    } catch {
      toast.error("Delete failed.");
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
        <h1 className="font-display text-3xl text-espresso">Inquiries</h1>
        <div className="flex gap-2">
          {["", ...statusOptions].map((s) => (
            <button
              key={s || "all"}
              onClick={() => setSearchParams(s ? { status: s } : {})}
              className={`px-3.5 py-1.5 text-xs uppercase tracking-wide border capitalize ${
                statusFilter === s ? "bg-espresso text-ivory border-espresso" : "border-espresso/20 text-espresso/60"
              }`}
            >
              {s || "All"}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <Loader label="Loading inquiries" />
      ) : (
        <div className="bg-ivory border border-espresso/10">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-[11px] uppercase tracking-wide text-espresso/40 border-b border-espresso/10">
                <th className="px-6 py-3 font-medium">Name / Company</th>
                <th className="px-6 py-3 font-medium">Type</th>
                <th className="px-6 py-3 font-medium">Product</th>
                <th className="px-6 py-3 font-medium">Status</th>
                <th className="px-6 py-3 font-medium">Date</th>
                <th className="px-6 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {inquiries.map((inq) => (
                <tr key={inq._id} className="border-b border-espresso/5 last:border-0 hover:bg-bone/50 cursor-pointer" onClick={() => setSelected(inq)}>
                  <td className="px-6 py-3.5">
                    <p className="text-espresso font-medium">{inq.name}</p>
                    <p className="text-xs text-espresso/40">{inq.company || inq.email}</p>
                  </td>
                  <td className="px-6 py-3.5 capitalize text-espresso/60">{inq.type}</td>
                  <td className="px-6 py-3.5 text-espresso/60">{inq.productName || "—"}</td>
                  <td className="px-6 py-3.5" onClick={(e) => e.stopPropagation()}>
                    <select
                      value={inq.status}
                      onChange={(e) => updateStatus(inq._id, e.target.value)}
                      className="text-xs border border-espresso/15 px-2 py-1 bg-transparent capitalize"
                    >
                      {statusOptions.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </td>
                  <td className="px-6 py-3.5 text-espresso/50">{new Date(inq.createdAt).toLocaleDateString()}</td>
                  <td className="px-6 py-3.5 text-right" onClick={(e) => e.stopPropagation()}>
                    <button onClick={() => handleDelete(inq._id)} className="text-espresso/50 hover:text-rust">
                      <FiTrash2 size={15} />
                    </button>
                  </td>
                </tr>
              ))}
              {inquiries.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center text-espresso/40">
                    No inquiries found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-espresso/60 backdrop-blur-sm px-6" onClick={() => setSelected(null)}>
          <div className="w-full max-w-lg bg-ivory p-8 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-xl text-espresso">Inquiry Details</h2>
              <button onClick={() => setSelected(null)}>
                <FiX size={20} />
              </button>
            </div>
            <dl className="space-y-3 text-sm">
              {[
                ["Type", selected.type],
                ["Name", selected.name],
                ["Company", selected.company || "—"],
                ["Email", selected.email],
                ["Phone", selected.phone],
                ["Country", selected.country || "—"],
                ["Product", selected.productName || "—"],
                ["Quantity", selected.quantity || "—"],
                ["Message", selected.message || "—"],
                ["Submitted", new Date(selected.createdAt).toLocaleString()],
              ].map(([label, value]) => (
                <div key={label} className="grid grid-cols-3 gap-4">
                  <dt className="text-espresso/40 uppercase text-[11px] tracking-wide pt-0.5">{label}</dt>
                  <dd className="col-span-2 text-espresso">{value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminInquiries;
