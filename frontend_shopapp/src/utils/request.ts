import axios, { AxiosRequestConfig } from "axios";
import { enqueueSnackbar } from "notistack";
import { store } from "@/stores";
import { logoutUser } from "@/stores/authSlice";

// 1. ĐỔI THÀNH DOMAIN CÓ HTTPS VÀ PATH /API
export const instanceAxios = axios.create({
  baseURL: "https://tonypham.duckdns.org/api", 
  headers: {
    "Content-Type": "application/json",
  },
});

instanceAxios.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

instanceAxios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refresh_token = localStorage.getItem("refreshToken");
        if (!refresh_token) throw new Error("No refresh token available");

        // 2. CHỖ NÀY CŨNG PHẢI ĐỔI THÀNH DOMAIN/HTTPS
        const response = await axios.post(
          "https://tonypham.duckdns.org/api/users/refresh-token",
          { refresh_token }
        );

        const { access_token, refresh_token: new_refresh_token } = response.data;

        localStorage.setItem("accessToken", access_token);
        if (new_refresh_token) {
          localStorage.setItem("refreshToken", new_refresh_token);
        }

        originalRequest.headers.Authorization = `Bearer ${access_token}`;
        return instanceAxios(originalRequest);
      } catch (refreshError) {
        store.dispatch(logoutUser());
        enqueueSnackbar("Session expired. Please log in again.", { variant: "warning" });
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    // Xử lý thông báo lỗi
    if (error.message === "Network Error") {
      enqueueSnackbar("Lỗi kết nối (CORS hoặc HTTPS). Check F12 Console!", { variant: "error" });
    } else {
      enqueueSnackbar(error.response?.data?.message || "Something went wrong", { variant: "error" });
    }

    return Promise.reject(error);
  }
);

export default function request(options: AxiosRequestConfig) {
  return instanceAxios(options);
}
