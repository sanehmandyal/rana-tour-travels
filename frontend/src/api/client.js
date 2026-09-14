import axios from "axios";

// Point to Render backend URL in production (e.g. VITE_API_URL=https://your-backend.onrender.com)
// In local development, falls back to "/api" which Vite proxies to localhost:5000
const rawBaseURL = import.meta.env.VITE_API_URL || "";
const baseURL = rawBaseURL ? `${rawBaseURL.replace(/\/+$/, "")}/api` : "/api";

const client = axios.create({
  baseURL,
  withCredentials: true,
});

// Attach Authorization Bearer token from localStorage for seamless cross-domain auth
client.interceptors.request.use((config) => {
  const token = localStorage.getItem("rana_token");
  if (token && !config.headers.Authorization) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default client;
