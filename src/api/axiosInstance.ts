import axios from "axios";
import { queryClient } from "@/api/queryClient";

const isMobile = () => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
};

const LOCAL_API_HOST = "http://localhost:3000";
const MOBILE_API_HOST = "http://192.168.1.6:3000";

const baseURL = import.meta.env.PROD ? "" : isMobile() ? MOBILE_API_HOST : LOCAL_API_HOST;

const api = axios.create({
  baseURL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const errorMessage = error?.response?.data?.message;

    if (
      (error.response?.status === 401 || error.response?.status === 403) &&
      !originalRequest._retry
    ) {
      // If no refresh token, do not attempt refresh
      if (errorMessage === "No Refresh Token") {
        queryClient.removeQueries({ queryKey: ["auth"] });
        return Promise.reject(error);
      }
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
