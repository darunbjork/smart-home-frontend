import axios from "axios";

// * Creating a dedicated instance ensures all our API calls
// * share the same base configuration automatically.
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true, // ! MANDATORY: Required for HttpOnly refresh cookies
  headers: {
    "Content-Type": "application/json",
  },
});