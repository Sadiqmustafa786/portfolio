import { NavLink, Link } from "react-router-dom";
import { ROUTES, APP_NAME } from "../../utils/constants";
import { useState } from "react";
import logo from "../../assets/images/logo.png";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const navClass = ({ isActive }) =>
    `px-4 py-2 rounded-md font-medium transition-all duration-300 ${
      isActive
        ? "bg-gradient-to-r from-primary to-secondary text-white shadow-md"
        : "text-slate-300 hover:text-primary"
    }`;

  return (
    <nav className="sticky top-0 z-50 border-b border-slate-700 bg-slate-900/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link to={ROUTES.HOME} className="flex shrink-0 items-center">
          <img
            src={logo}
            alt={APP_NAME}
            className="h-10 w-auto object-contain sm:h-11"
          />
        </Link>

        <ul className="hidden items-center gap-5 md:flex">
          <li>
            <NavLink to={ROUTES.HOME} className={navClass}>
              Home
            </NavLink>
          </li>
          <li>
            <NavLink to={ROUTES.ABOUT} className={navClass}>
              About
            </NavLink>
          </li>
          <li>
            <NavLink to={ROUTES.PROJECTS} className={navClass}>
              Projects
            </NavLink>
          </li>
          <li>
            <NavLink to={ROUTES.CONTACT} className={navClass}>
              Contact
            </NavLink>
          </li>
        </ul>

        <button
          type="button"
          onClick={() => setMenuOpen(!menuOpen)}
          className="text-2xl text-white md:hidden"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
        >
          {menuOpen ? "✖" : "☰"}
        </button>
      </div>

      {menuOpen && (
        <div className="border-t border-slate-700 md:hidden">
          <ul className="flex flex-col items-center gap-4 py-4">
            <li>
              <NavLink to={ROUTES.HOME} className={navClass} onClick={() => setMenuOpen(false)}>
                Home
              </NavLink>
            </li>
            <li>
              <NavLink to={ROUTES.ABOUT} className={navClass} onClick={() => setMenuOpen(false)}>
                About
              </NavLink>
            </li>
            <li>
              <NavLink to={ROUTES.PROJECTS} className={navClass} onClick={() => setMenuOpen(false)}>
                Projects
              </NavLink>
            </li>
            <li>
              <NavLink to={ROUTES.CONTACT} className={navClass} onClick={() => setMenuOpen(false)}>
                Contact
              </NavLink>
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
}
