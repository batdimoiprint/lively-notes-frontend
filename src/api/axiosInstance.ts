import axios from "axios";
import { queryClient } from "@/api/queryClient";

const api = axios.create({
  baseURL: import.meta.env.PROD ? import.meta.env.VITE_ENV_BASE_URL : "http://localhost:3000",
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        await api.post("/api/auth/refresh");
        return api(originalRequest);
      } catch (refreshError) {
        queryClient.removeQueries({ queryKey: ["auth"] });

        return Promise.reject(refreshError || error);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
