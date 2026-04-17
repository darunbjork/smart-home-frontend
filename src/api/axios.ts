import axios, { type InternalAxiosRequestConfig } from "axios";
import { tokenUtils } from "../utils/token";
import { authApi } from "./auth.api";
import { globalShowToast } from "../services/toast.service"; 

export interface RetryableAxiosConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}
// * Creating a dedicated instance ensures all our API calls
// * share the same base configuration automatically.
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true, // ! MANDATORY: Required for HttpOnly refresh cookies
  headers: {
    "Content-Type": "application/json",
  },
});

// * Automatically attach the token to every request
api.interceptors.request.use((config) => {
  const token = tokenUtils.getToken(); 
  console.log("🔍 Interceptor running for:", config.url); 
  console.log("📦 Token from localStorage:", token); 
  if (token) {
    config.headers = config.headers || {}; 
    config.headers.Authorization = `Bearer ${token}`;
    console.log("✅ Header set:", config.headers.Authorization); 
  } else {
    console.warn("⚠️ No token or headers missing"); 
  }
  return config;
});

// * Catch 401s, silently refresh, and retry
api.interceptors.response.use(
  (response) => response,
  async (error: unknown) => {
    if (!axios.isAxiosError(error)) return Promise.reject(error);
    const originalRequest = error.config as RetryableAxiosConfig | undefined;

    if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
      originalRequest._retry = true; // Mark to prevent infinite loops
      
      try {
        const { accessToken } = await authApi.refresh(); 
        tokenUtils.setToken(accessToken); 
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        tokenUtils.clear();
     
        if (typeof window !== 'undefined') {
            window.location.href = "/login";
        }
        globalShowToast("Your session has expired. Please log in again.", "error");
        return Promise.reject(refreshError);
      }
    }
 
    const errorMessage = error.response?.data?.message || "An unexpected error occurred.";
    console.error("API Error:", errorMessage, error.response);
    globalShowToast(errorMessage, "error");

    return Promise.reject(error);
  }
);
