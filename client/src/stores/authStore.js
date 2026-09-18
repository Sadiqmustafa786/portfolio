import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      setUser: (user, token) =>
        set({
          user,
          token: token ?? null,
          isAuthenticated: !!(user && (token ?? true)),
        }),
      logout: () => set({ user: null, token: null, isAuthenticated: false }),
    }),
    { name: "auth-storage" },
  ),
);
