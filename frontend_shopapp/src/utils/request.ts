import axios, { AxiosRequestConfig } from "axios";
import { store } from "@/stores";
import { logoutUser, refreshToken } from "@/stores/authSlice";

const API_URL = import.meta.env.VITE_API_URL;
export const instanceAxios = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

const isTokenExpired = (): boolean => {
  const expiration = localStorage.getItem("tokenExpiration");
  if (!expiration) return false;

  const expirationTime = new Date(expiration).getTime();
  const currentTime = Date.now();

  return currentTime >= expirationTime - 5 * 60 * 1000;
};

// ===== REQUEST INTERCEPTOR =====
instanceAxios.interceptors.request.use(
  async (config) => {
    const token = localStorage.getItem("accessToken");

    if (token && isTokenExpired()) {
      const result = await store.dispatch(refreshToken());

      if (refreshToken.fulfilled.match(result)) {
        const newToken = localStorage.getItem("accessToken");
        if (newToken) {
          config.headers.Authorization = `Bearer ${newToken}`;
        }
      }
    } else if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// ===== RESPONSE INTERCEPTOR =====
instanceAxios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const result = await store.dispatch(refreshToken());

      if (refreshToken.fulfilled.match(result)) {
        const newToken = localStorage.getItem("accessToken");
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return instanceAxios(originalRequest);
      }

      store.dispatch(logoutUser());
    }

    return Promise.reject(error);
  }
);

export default function request(options: AxiosRequestConfig) {
  return instanceAxios(options);
}
