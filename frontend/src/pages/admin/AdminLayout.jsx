import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  FiGrid,
  FiBox,
  FiTag,
  FiMail,
  FiSettings,
  FiLogOut,
  FiExternalLink,
  FiStar,
} from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";

const navItems = [
  { to: "/admin", label: "Dashboard", icon: FiGrid, end: true },
  { to: "/admin/products", label: "Products", icon: FiBox },
  { to: "/admin/categories", label: "Categories", icon: FiTag },
  { to: "/admin/inquiries", label: "Inquiries", icon: FiMail },
  { to: "/admin/testimonials", label: "Testimonials", icon: FiStar },
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
    <div className="min-h-screen flex flex-col bg-bone lg:flex-row">
      <aside className="flex w-full shrink-0 flex-col bg-espresso text-ivory lg:w-64">
        <div className="border-b border-ivory/10 px-5 py-3 sm:px-6 sm:py-5 lg:py-6">
          <h1 className="font-display text-2xl">BagHaus</h1>
          <p className="text-[10px] tracking-widest2 uppercase text-camel-light mt-1">Admin Panel</p>
        </div>

        <nav aria-label="Admin navigation" className="flex gap-1 overflow-x-auto overscroll-x-contain px-3 py-2 lg:block lg:flex-1 lg:space-y-1 lg:overflow-visible lg:py-6">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `flex min-h-11 shrink-0 items-center gap-2 whitespace-nowrap rounded-lg px-3 py-2 text-sm transition-colors sm:gap-3 sm:px-3.5 ${
                  isActive ? "bg-camel text-ivory" : "text-ivory/60 hover:bg-ivory/5 hover:text-ivory"
                }`
              }
            >
              <item.icon size={16} />
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex gap-1 border-t border-ivory/10 px-3 py-2 lg:block lg:space-y-1 lg:py-5">
          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className="flex min-h-11 flex-1 items-center justify-center gap-2 rounded-lg px-2 py-2 text-xs text-ivory/70 hover:bg-ivory/5 hover:text-ivory sm:text-sm lg:justify-start lg:gap-3 lg:px-3.5"
          >
            <FiExternalLink size={16} /> View Site
          </a>
          <button
            onClick={handleLogout}
            className="flex min-h-11 flex-1 items-center justify-center gap-2 rounded-lg px-2 py-2 text-xs text-ivory/70 hover:bg-ivory/5 hover:text-ivory sm:text-sm lg:w-full lg:justify-start lg:gap-3 lg:px-3.5"
          >
            <FiLogOut size={16} /> Log Out
          </button>
        </div>
      </aside>

      <main className="flex-1 min-w-0">
        <header className="flex items-center justify-between border-b border-espresso/10 bg-ivory px-4 py-4 sm:px-6 lg:px-8">
          <p className="text-sm text-espresso/50">
            Signed in as <span className="text-espresso font-medium">{admin?.name}</span>
          </p>
        </header>
        <div className="p-4 sm:p-6 lg:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
