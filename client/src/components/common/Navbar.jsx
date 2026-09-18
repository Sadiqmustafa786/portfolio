import { NavLink, Link } from "react-router-dom";
import { ROUTES, APP_NAME } from "../../utils/constants";
import { useThemeStore } from "../../stores/themeStore";
import { useState } from "react";

export default function Navbar() {
  const theme = useThemeStore((state) => state.theme);
  const toggleTheme = useThemeStore((state) => state.toggleTheme);
  const [menuOpen, setMenuOpen] = useState(false);

  const navClass = ({ isActive }) =>
    `px-4 py-2 rounded-md font-medium transition-all duration-300 ${
      isActive
        ? "bg-gradient-to-r from-primary to-secondary text-white shadow-md"
        : "text-slate-600 dark:text-slate-300 hover:text-primary"
    }`;

  return (
    <nav className="border-b border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
        {/* Logo */}
        <Link
          to={ROUTES.HOME}
          className="text-lg font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent"
        >
          {APP_NAME}
        </Link>

        {/* Desktop Menu */}
        <ul className="hidden md:flex items-center gap-5">
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

          {/* Theme Toggle */}
          <li>
            <button
              type="button"
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition-all duration-300"
            >
              {theme === "light" ? "🌙" : "☀️"}
            </button>
          </li>
        </ul>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden text-2xl text-slate-700 dark:text-white"
        >
          {menuOpen ? "✖" : "☰"}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-slate-200 dark:border-slate-700">
          <ul className="flex flex-col items-center gap-4 py-4">
            <li>
              <NavLink
                to={ROUTES.HOME}
                className={navClass}
                onClick={() => setMenuOpen(false)}
              >
                Home
              </NavLink>
            </li>

            <li>
              <NavLink
                to={ROUTES.ABOUT}
                className={navClass}
                onClick={() => setMenuOpen(false)}
              >
                About
              </NavLink>
            </li>

            <li>
              <NavLink
                to={ROUTES.PROJECTS}
                className={navClass}
                onClick={() => setMenuOpen(false)}
              >
                Projects
              </NavLink>
            </li>

            <li>
              <NavLink
                to={ROUTES.CONTACT}
                className={navClass}
                onClick={() => setMenuOpen(false)}
              >
                Contact
              </NavLink>
            </li>

            <li>
              <button
                onClick={toggleTheme}
                className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700"
              >
                {theme === "light" ? "🌙 Dark" : "☀️ Light"}
              </button>
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
}
