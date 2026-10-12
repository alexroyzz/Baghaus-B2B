import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FiBox, FiTag, FiMail, FiInbox } from "react-icons/fi";
import api from "../../api/axios";
import Loader from "../../components/Loader";

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [recentInquiries, setRecentInquiries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get("/products?all=true&limit=1"),
      api.get("/categories?all=true"),
      api.get("/inquiries/stats"),
      api.get("/inquiries?limit=6"),
    ])
      .then(([prodRes, catRes, statsRes, inqRes]) => {
        setStats({
          products: prodRes.data.pagination.total,
          categories: catRes.data.data.length,
          ...statsRes.data.data,
        });
        setRecentInquiries(inqRes.data.data);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader label="Loading dashboard" />;

  const cards = [
    { label: "Products", value: stats.products, icon: FiBox, to: "/admin/products" },
    { label: "Categories", value: stats.categories, icon: FiTag, to: "/admin/categories" },
    { label: "Total Inquiries", value: stats.total, icon: FiMail, to: "/admin/inquiries" },
    { label: "New Inquiries", value: stats.newCount, icon: FiInbox, to: "/admin/inquiries?status=new" },
  ];

  return (
    <div>
      <h1 className="font-display text-3xl text-espresso mb-8">Dashboard</h1>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-12">
        {cards.map((c) => (
          <Link key={c.label} to={c.to} className="bg-ivory p-6 border border-espresso/10 hover:border-camel transition-colors">
            <c.icon className="text-camel mb-4" size={20} />
            <p className="font-display text-3xl text-espresso mb-1">{c.value}</p>
            <p className="text-xs uppercase tracking-widest2 text-espresso/50">{c.label}</p>
          </Link>
        ))}
      </div>

      <div className="bg-ivory border border-espresso/10">
        <div className="px-6 py-4 border-b border-espresso/10 flex items-center justify-between">
          <h2 className="font-display text-lg text-espresso">Recent Inquiries</h2>
          <Link to="/admin/inquiries" className="text-xs uppercase tracking-widest2 text-camel">
            View All
          </Link>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-[11px] uppercase tracking-wide text-espresso/40 border-b border-espresso/10">
              <th className="px-6 py-3 font-medium">Name</th>
              <th className="px-6 py-3 font-medium">Type</th>
              <th className="px-6 py-3 font-medium">Product</th>
              <th className="px-6 py-3 font-medium">Status</th>
              <th className="px-6 py-3 font-medium">Date</th>
            </tr>
          </thead>
          <tbody>
            {recentInquiries.map((inq) => (
              <tr key={inq._id} className="border-b border-espresso/5 last:border-0">
                <td className="px-6 py-3.5">
                  <p className="text-espresso">{inq.name}</p>
                  <p className="text-xs text-espresso/40">{inq.email}</p>
                </td>
                <td className="px-6 py-3.5 capitalize text-espresso/70">{inq.type}</td>
                <td className="px-6 py-3.5 text-espresso/70">{inq.productName || "—"}</td>
                <td className="px-6 py-3.5">
                  <span className="text-xs px-2 py-1 bg-bone capitalize">{inq.status}</span>
                </td>
                <td className="px-6 py-3.5 text-espresso/50">{new Date(inq.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
            {recentInquiries.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-10 text-center text-espresso/40">
                  No inquiries yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDashboard;
