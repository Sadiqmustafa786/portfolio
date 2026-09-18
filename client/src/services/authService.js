import api from "./api.js";

export const authService = {
  register: (data) => api.post("/auth/register", data),
  login: (credentials) => api.post("/auth/login", credentials),
  logout: () => api.post("/auth/logout"),
  getMe: () => api.get("/auth/me"),
};
