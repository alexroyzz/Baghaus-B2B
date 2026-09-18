import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  FiGrid,
  FiBox,
  FiTag,
  FiMail,
  FiSettings,
  FiLogOut,
  FiExternalLink,
} from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";

const navItems = [
  { to: "/admin", label: "Dashboard", icon: FiGrid, end: true },
  { to: "/admin/products", label: "Products", icon: FiBox },
  { to: "/admin/categories", label: "Categories", icon: FiTag },
  { to: "/admin/inquiries", label: "Inquiries", icon: FiMail },
  { to: "/admin/settings", label: "Settings", icon: FiSettings },
];

const AdminLayout = () => {
  const { admin, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/admin/login");
  };

  return (
    <div className="min-h-screen flex bg-bone">
      <aside className="w-64 shrink-0 bg-espresso text-ivory flex flex-col">
        <div className="px-6 py-7 border-b border-ivory/10">
          <h1 className="font-display text-2xl">BagHaus</h1>
          <p className="text-[10px] tracking-widest2 uppercase text-camel-light mt-1">Admin Panel</p>
        </div>

        <nav className="flex-1 px-3 py-6 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3.5 py-2.5 text-sm rounded-sm transition-colors ${
                  isActive ? "bg-camel text-ivory" : "text-ivory/60 hover:bg-ivory/5 hover:text-ivory"
                }`
              }
            >
              <item.icon size={16} />
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="px-3 py-5 border-t border-ivory/10 space-y-1">
          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-3 px-3.5 py-2.5 text-sm text-ivory/60 hover:text-ivory"
          >
            <FiExternalLink size={16} /> View Site
          </a>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3.5 py-2.5 text-sm text-ivory/60 hover:text-ivory"
          >
            <FiLogOut size={16} /> Log Out
          </button>
        </div>
      </aside>

      <main className="flex-1 min-w-0">
        <header className="bg-ivory border-b border-espresso/10 px-8 py-4 flex items-center justify-between">
          <p className="text-sm text-espresso/50">
            Signed in as <span className="text-espresso font-medium">{admin?.name}</span>
          </p>
        </header>
        <div className="p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
