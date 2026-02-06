import axios, { AxiosRequestConfig } from "axios";
import { enqueueSnackbar } from "notistack";
import { store } from "@/stores";
import { logoutUser, refreshToken } from "@/stores/authSlice";

export const instanceAxios = axios.create({
  baseURL: "/api",
  headers: { "Content-Type": "application/json" },
});

instanceAxios.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

instanceAxios.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
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
        if (!refresh_token) {
          throw new Error("No refresh token available");
        }

        const response = await axios.post("api/users/refresh-token", {
          refresh_token,
        });

        const { access_token, refresh_token: new_refresh_token } =
          response.data;

        // Lưu token mới
        localStorage.setItem("accessToken", access_token);
        if (new_refresh_token) {
          localStorage.setItem("refreshToken", new_refresh_token);
        }

        // Cập nhật header và retry request
        originalRequest.headers.Authorization = `Bearer ${access_token}`;
        return instanceAxios(originalRequest);
      } catch (refreshError) {
        // Refresh token thất bại, logout
        store.dispatch(logoutUser());
        enqueueSnackbar("Session expired. Please log in again.", {
          variant: "warning",
        });
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    // Các lỗi khác
    if (error.response?.status === 403) {
      enqueueSnackbar("Access denied. You don't have permission.", {
        variant: "error",
      });
    } else if (error.response?.status >= 500) {
      enqueueSnackbar("Server error. Please try again later.", {
        variant: "error",
      });
    } else if (error.message === "Network Error") {
      enqueueSnackbar("Network error. Please check your connection.", {
        variant: "error",
      });
    } else {
      enqueueSnackbar(
        error.response?.data?.message ||
          error.response?.data?.error ||
          "Something went wrong",
        { variant: "error" }
      );
    }

    return Promise.reject(error);
  }
);

export default function request(options: AxiosRequestConfig) {
  return instanceAxios(options);
}
