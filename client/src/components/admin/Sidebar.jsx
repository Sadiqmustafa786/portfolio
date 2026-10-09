import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { ROUTES } from "../../utils/constants";
import { useAuthStore } from "../../stores/authStore";

const navItems = [
  {
    label: "Dashboard",
    to: ROUTES.ADMIN_DASHBOARD,
    icon: "🏠",
    description: "Overview",
  },
  {
    label: "Projects",
    to: ROUTES.ADMIN_PROJECTS,
    icon: "📁",
    description: "Portfolio items",
  },
  {
    label: "Contacts",
    to: ROUTES.ADMIN_CONTACTS,
    icon: "✉️",
    description: "Messages",
  },
  {
    label: "CV",
    to: ROUTES.ADMIN_CV,
    icon: "📄",
    description: "Resume",
  },
];

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  const handleLogout = () => {
    logout();
    navigate(ROUTES.ADMIN_LOGIN, { replace: true });
  };

  const isActive = (path) => {
    if (path === ROUTES.ADMIN_DASHBOARD) {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  return (
    <aside className="w-full border-b border-slate-200 bg-white/90 backdrop-blur-sm dark:border-slate-700 dark:bg-slate-900/80 md:w-72 md:border-b-0 md:border-r">
      <div className="flex h-full flex-col p-5">
        <div className="mb-8">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
            Portfolio
          </p>
          <h2 className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">
            Admin Panel
          </h2>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Welcome, {user?.name || user?.email || "Admin"}
          </p>
        </div>

        <nav className="space-y-2">
          {navItems.map(({ label, to, icon, description }) => (
            <NavLink
              key={to}
              to={to}
              className={() =>
                `flex items-center gap-3 rounded-xl border px-3 py-3 transition-all ${
                  isActive(to)
                    ? "border-primary/30 bg-primary/10 text-primary shadow-sm dark:border-primary/40 dark:bg-primary/10"
                    : "border-transparent bg-slate-50 text-slate-700 hover:border-slate-200 hover:bg-slate-100 dark:bg-slate-800/70 dark:text-slate-200 dark:hover:border-slate-600 dark:hover:bg-slate-800"
                }`
              }
            >
              <span className="text-lg">{icon}</span>
              <span className="flex-1 text-left">
                <span className="block text-sm font-semibold">{label}</span>
                <span className="block text-[11px] text-slate-500 dark:text-slate-400">
                  {description}
                </span>
              </span>
            </NavLink>
          ))}
        </nav>

        <div className="mt-auto pt-6">
          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 px-3 py-2.5 text-sm font-medium text-slate-600 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600 dark:border-slate-700 dark:text-slate-300 dark:hover:border-red-700 dark:hover:bg-red-950/30 dark:hover:text-red-400"
          >
            <span>🚪</span>
            Logout
          </button>
        </div>
      </div>
    </aside>
  );
}
