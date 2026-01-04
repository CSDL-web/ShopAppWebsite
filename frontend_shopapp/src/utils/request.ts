import axios, { AxiosRequestConfig } from "axios";
import { enqueueSnackbar } from "notistack";
import { store } from "@/stores";
import { logoutUser } from "@/stores/authSlice";

export const instanceAxios = axios.create({
  baseURL: "http://localhost:5000",
  headers: {
    "Content-Type": "application/json",
  },
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
  (error) => {
    if (error.response?.status === 401) {
      store.dispatch(logoutUser());
      enqueueSnackbar("Session expired. Please log in again.", {
        variant: "warning",
      });
    } else {
      enqueueSnackbar(error.message || "Something went wrong", {
        variant: "error",
      });
    }
    return Promise.reject(error);
  }
);

export default function request(options: AxiosRequestConfig) {
  return instanceAxios(options);
}
