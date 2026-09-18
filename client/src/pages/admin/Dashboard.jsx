import { Link, useNavigate } from "react-router-dom";
import { ROUTES } from "../../utils/constants";
import { useAuthStore } from "../../stores/authStore";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  const displayName = user?.name || user?.email || "Admin";

  const handleLogout = () => {
    logout();
    navigate(ROUTES.ADMIN_LOGIN, { replace: true });
  };

  return (
    <div className="min-h-screen bg-slate-100 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <header className="mb-8">
          <h1 className="text-2xl font-bold text-slate-800">Admin Dashboard</h1>
          <p className="text-slate-600 mt-1">Welcome back, {displayName}.</p>
        </header>

        <div className="space-y-4">
          <Link
            to={ROUTES.ADMIN_PROJECTS}
            className="block p-6 bg-white rounded-xl border border-slate-200 hover:shadow-md hover:border-slate-300 transition-all"
          >
            <h2 className="text-lg font-semibold text-slate-800 mb-1">
              Manage Projects
            </h2>
            <p className="text-slate-600 text-sm">
              Add, edit, or remove portfolio projects.
            </p>
          </Link>

          <Link
            to={ROUTES.ADMIN_CONTACTS}
            className="block p-6 bg-white rounded-xl border border-slate-200 hover:shadow-md hover:border-slate-300 transition-all"
          >
            <h2 className="text-lg font-semibold text-slate-800 mb-1">
              Manage Contacts
            </h2>
            <p className="text-slate-600 text-sm">
              View and manage contact form submissions.
            </p>
          </Link>

          <Link
            to={ROUTES.ADMIN_CV}
            className="block p-6 bg-white rounded-xl border border-slate-200 hover:shadow-md hover:border-slate-300 transition-all"
          >
            <h2 className="text-lg font-semibold text-slate-800 mb-1">
              Manage CV
            </h2>
            <p className="text-slate-600 text-sm">
              Upload your PDF resume for the Download CV button on the home page.
            </p>
          </Link>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-200">
          <button
            type="button"
            onClick={handleLogout}
            className="px-4 py-2 text-slate-600 hover:text-slate-800 text-sm font-medium"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
