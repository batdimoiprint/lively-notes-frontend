import axios from "axios";
import { queryClient } from "@/api/queryClient";
import { logger } from "@/lib/logger";

const isMobile = () => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
};

const PROD_API_HOST = "https://1ai6l6vwae.execute-api.ap-southeast-1.amazonaws.com";
const LOCAL_API_HOST = "http://localhost:3000";
const MOBILE_API_HOST = "http://192.168.1.6:3000";

const baseURL = import.meta.env.PROD ? PROD_API_HOST : isMobile() ? MOBILE_API_HOST : LOCAL_API_HOST;

const api = axios.create({
  baseURL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const tokenFromStorage = localStorage.getItem("access_token");
    const match = document.cookie.match(/(?:^|; )access_token=([^;]*)/);
    const token = tokenFromStorage || (match ? decodeURIComponent(match[1]) : null);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const errorMessage = error?.response?.data?.message;

    // Log the API error centrally
    logger.error("HTTP Request Failed", {
      url: originalRequest?.url,
      method: originalRequest?.method,
      status: error.response?.status,
      message: errorMessage || error.message,
      error,
    });

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
