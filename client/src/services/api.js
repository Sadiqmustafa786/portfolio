import axios from "axios";
import { useAuthStore } from "../stores/authStore";

const DEFAULT_API_URL = "https://portfolio-55af.vercel.app/api";
const configuredApiUrl = import.meta.env.VITE_API_URL?.trim();

const isLocalApiUrl = (value) => {
  try {
    return ["localhost", "127.0.0.1", "::1"].includes(new URL(value).hostname);
  } catch {
    return false;
  }
};

export const API_BASE_URL =
  import.meta.env.PROD && isLocalApiUrl(configuredApiUrl)
    ? DEFAULT_API_URL
    : configuredApiUrl || DEFAULT_API_URL;

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
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
