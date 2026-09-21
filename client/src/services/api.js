import axios from "axios";
import { useAuthStore } from "../stores/authStore";

const api = axios.create({
  baseURL: "https://portfolio-backend-pi-roan.vercel.app/api",
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  let token = useAuthStore.getState().token;
  if (!token && typeof localStorage !== "undefined") {
    try {
      const raw = localStorage.getItem("auth-storage");
      if (raw) {
        const parsed = JSON.parse(raw);
        token = parsed?.state?.token ?? null;
      }
    } catch {
      token = null;
    }
  }
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
