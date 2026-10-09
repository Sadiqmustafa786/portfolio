import { Link } from "react-router-dom";
import { ROUTES, APP_NAME } from "../../utils/constants";
import logo from "../../assets/images/logo.png";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-slate-700 bg-slate-800/50 text-slate-300">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <Link to={ROUTES.HOME} className="flex shrink-0 items-center">
            <img
              src={logo}
              alt={APP_NAME}
              className="h-12 w-auto object-contain sm:h-14"
            />
          </Link>
          <ul className="flex items-center gap-6">
            <li>
              <Link to={ROUTES.HOME} className="transition-colors hover:text-primary">
                Home
              </Link>
            </li>
            <li>
              <Link to={ROUTES.ABOUT} className="transition-colors hover:text-primary">
                About
              </Link>
            </li>
            <li>
              <Link to={ROUTES.PROJECTS} className="transition-colors hover:text-primary">
                Projects
              </Link>
            </li>
            <li>
              <Link to={ROUTES.CONTACT} className="transition-colors hover:text-primary">
                Contact
              </Link>
            </li>
          </ul>
        </div>
        <p className="mt-6 text-center text-sm text-slate-400 sm:text-left">
          © {currentYear} {APP_NAME}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
