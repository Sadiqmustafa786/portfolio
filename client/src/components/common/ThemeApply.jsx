import { useEffect } from "react";

/** Forces dark theme site-wide. Light mode is disabled. */
export default function ThemeApply() {
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove("light");
    root.classList.add("dark");
    try {
      localStorage.removeItem("theme-storage");
    } catch {
      /* ignore */
    }
  }, []);

  return null;
}
