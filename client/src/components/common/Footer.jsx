import { Link } from "react-router-dom";
import { ROUTES, APP_NAME } from "../../utils/constants";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-300">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="font-medium text-primary">{APP_NAME}</span>
          <ul className="flex items-center gap-6">
            <li>
              <Link
                to={ROUTES.HOME}
                className="hover:text-primary transition-colors"
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                to={ROUTES.ABOUT}
                className="hover:text-primary transition-colors"
              >
                About
              </Link>
            </li>
            <li>
              <Link
                to={ROUTES.PROJECTS}
                className="hover:text-primary transition-colors"
              >
                Projects
              </Link>
            </li>
            <li>
              <Link
                to={ROUTES.CONTACT}
                className="hover:text-primary transition-colors"
              >
                Contact
              </Link>
            </li>
          </ul>
        </div>
        <p className="mt-6 text-center sm:text-left text-sm text-slate-500 dark:text-slate-400">
          © {currentYear} {APP_NAME}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
