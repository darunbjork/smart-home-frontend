import axios, { type InternalAxiosRequestConfig } from "axios";
import { tokenUtils } from "../utils/token";
import { authApi } from "./auth.api";
import { globalShowToast } from "../services/toast.service"; // Import globalShowToast

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
  const token = tokenUtils.get();
  console.log("🔍 Interceptor running for:", config.url); 
  console.log("📦 Token from localStorage:", token); 
  if (token) {
    config.headers = config.headers || {}; // ! Ensure headers object exists
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
    // 1. Ensure it's an Axios error and grab the config
    if (!axios.isAxiosError(error)) return Promise.reject(error);
    const originalRequest = error.config as RetryableAxiosConfig | undefined;

    // 2. If it's a 401, and we haven't already retried this exact request
    if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
      originalRequest._retry = true; // Mark to prevent infinite loops
      
      try {
        // 3. The magic: Ask the backend for a new token using the HttpOnly cookie
        // NOTE: This assumes authApi has a 'refresh' method.
        const { accessToken } = await authApi.refresh(); 
        tokenUtils.set(accessToken);
        
        // 4. Update the failed request with the new token and fire it again
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        // 5. If the refresh token is also dead, the session is truly over. Boot them.
        tokenUtils.clear();
        // Note: window.location.href might not be available in all environments (e.g., Node.js tests).
        // For frontend apps, this is standard.
        if (typeof window !== 'undefined') {
            window.location.href = "/login";
        }
        globalShowToast("Your session has expired. Please log in again.", "error"); // Show toast for session expiry
        return Promise.reject(refreshError);
      }
    }
    
    // Global error message for the user for other errors (e.g., 500)
    const errorMessage = error.response?.data?.message || "An unexpected error occurred.";
    console.error("API Error:", errorMessage, error.response);
    globalShowToast(errorMessage, "error");

    return Promise.reject(error);
  }
);
