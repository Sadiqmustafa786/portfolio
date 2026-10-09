import { create } from "zustand";

/** Site is dark-only. Store kept for compatibility; theme cannot change. */
export const useThemeStore = create(() => ({
  theme: "dark",
  setTheme: () => {},
  toggleTheme: () => {},
}));
