import axios, { AxiosRequestConfig } from "axios";
import { enqueueSnackbar } from "notistack";
import { store } from "@/stores";
import { actionLogout } from "@/stores/authSlice";

export const instanceAxios = axios.create({
  baseURL: "http://localhost:5000",
  headers: {
    "Content-Type": "application/json",
  },
});

instanceAxios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      store.dispatch(actionLogout());
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
