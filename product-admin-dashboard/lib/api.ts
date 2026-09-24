import axios from "axios";
import { clearAuth, getToken } from "./auth";

export const api = axios.create({
  baseURL: "https://dummyjson.com",
});

export interface ApiError extends Error {
  status?: number;
}

api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (axios.isCancel(error)) {
      return Promise.reject(error);
    }

    if (error.response?.status === 401) {
      clearAuth();
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
    }

    const message =
      error.response?.data?.message || error.message || "Something went wrong. Please try again.";
    const apiError: ApiError = new Error(message);
    apiError.status = error.response?.status;
    return Promise.reject(apiError);
  }
);
