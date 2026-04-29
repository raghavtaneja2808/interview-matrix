import axios from "axios";

const baseURL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (r) => r,
  (err) => {
    if (err?.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      if (!window.location.pathname.startsWith("/auth") && window.location.pathname !== "/") {
        window.location.href = "/auth";
      }
    }
    return Promise.reject(err);
  }
);

export default api;

export function apiError(err, fallback = "Something went wrong.") {
  return err?.response?.data?.error || err?.message || fallback;
}
