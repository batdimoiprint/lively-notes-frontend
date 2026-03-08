import axios from "axios";
import { queryClient } from "@/api/queryClient";

const isMobile = () => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
};

const baseURL = import.meta.env.PROD
  ? " "
  : isMobile()
    ? "http://192.168.1.6:3000"
    : "http://localhost:3000";

const api = axios.create({
  baseURL,
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
