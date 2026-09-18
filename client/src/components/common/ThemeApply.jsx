import { useEffect } from "react";
import { useThemeStore } from "../../stores/themeStore";

export default function ThemeApply() {
  const theme = useThemeStore((state) => state.theme);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(theme || "light");
  }, [theme]);

  return null;
}
