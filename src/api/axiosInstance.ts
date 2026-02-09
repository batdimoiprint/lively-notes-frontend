import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.PROD ? import.meta.env.VITE_ENV_BASE_URL : "http://localhost:3000",
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

export default api;
