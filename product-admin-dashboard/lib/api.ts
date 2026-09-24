import axios from "axios";
import { clearAuth, getToken } from "./auth";

// ONE shared Axios instance for the whole app. Every service file
// (authService, productService) imports this instead of calling
// axios.get/post directly, so the token attachment and error handling
// below apply everywhere automatically.
export const api = axios.create({
  baseURL: "https://dummyjson.com",
});

// Attach the login token to every outgoing request, if we have one.
api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle errors in one place instead of repeating try/catch details
// in every component.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // A cancelled request (from our search-cancellation logic) is not a
    // real error - let the caller's own cancellation check handle it.
    if (axios.isCancel(error)) {
      return Promise.reject(error);
    }

    // Token expired or invalid: log the user out so the app doesn't sit
    // in a broken "logged in but every call fails" state.
    if (error.response?.status === 401) {
      clearAuth();
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
    }

    const message =
      error.response?.data?.message || error.message || "Something went wrong. Please try again.";
    return Promise.reject(new Error(message));
  }
);
