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
    <div className="min-h-screen bg-slate-100 px-4 py-8 dark:bg-slate-950">
      <div className="mx-auto max-w-2xl">
        <header className="mb-8">
          <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
            Admin Dashboard
          </h1>
          <p className="mt-1 text-slate-600 dark:text-slate-300">
            Welcome back, {displayName}.
          </p>
        </header>

        <div className="space-y-4">
          <Link
            to={ROUTES.ADMIN_PROJECTS}
            className="block rounded-xl border border-slate-200 bg-white p-6 transition-all hover:border-slate-300 hover:shadow-md dark:border-slate-700 dark:bg-slate-800 dark:hover:border-slate-600"
          >
            <h2 className="mb-1 text-lg font-semibold text-slate-800 dark:text-slate-100">
              Manage Projects
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-300">
              Add, edit, or remove portfolio projects.
            </p>
          </Link>

          <Link
            to={ROUTES.ADMIN_CONTACTS}
            className="block rounded-xl border border-slate-200 bg-white p-6 transition-all hover:border-slate-300 hover:shadow-md dark:border-slate-700 dark:bg-slate-800 dark:hover:border-slate-600"
          >
            <h2 className="mb-1 text-lg font-semibold text-slate-800 dark:text-slate-100">
              Manage Contacts
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-300">
              View and manage contact form submissions.
            </p>
          </Link>

          <Link
            to={ROUTES.ADMIN_CV}
            className="block rounded-xl border border-slate-200 bg-white p-6 transition-all hover:border-slate-300 hover:shadow-md dark:border-slate-700 dark:bg-slate-800 dark:hover:border-slate-600"
          >
            <h2 className="mb-1 text-lg font-semibold text-slate-800 dark:text-slate-100">
              Manage CV
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-300">
              Upload your PDF resume for the Download CV button on the home page.
            </p>
          </Link>
        </div>

      </div>
    </div>
  );
}
