import { NavLink, Link } from "react-router-dom";
import { ROUTES, APP_NAME } from "../../utils/constants";
import { useState } from "react";
import logo from "../../assets/images/logo.png";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const navClass = ({ isActive }) =>
    `rounded-md px-4 py-2 font-medium transition-all duration-300 ${
      isActive
        ? "bg-white/20 text-white shadow-md ring-1 ring-white/20"
        : "text-white/90 hover:bg-white/10 hover:text-white"
    }`;

  return (
    <nav className="sticky top-0 z-50 border-b border-slate-700/70 bg-slate-900/90 backdrop-blur-md">
      <svg
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 h-full w-full"
        viewBox="0 0 1000 64"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="navbar-wave-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#018790" />
            <stop offset="55%" stopColor="#00b7b5" />
            <stop offset="100%" stopColor="#0875a5" />
          </linearGradient>
        </defs>
        <path
          d="M 525 0 C 465 17 625 45 515 64 H 1000 V 0 Z"
          fill="url(#navbar-wave-gradient)"
        />
      </svg>

      <div className="relative z-10 mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
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
        <div className="relative z-10 border-t border-slate-700 bg-slate-900/95 md:hidden">
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
