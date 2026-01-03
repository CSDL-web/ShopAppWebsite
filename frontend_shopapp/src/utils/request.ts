import axios, { AxiosRequestConfig } from "axios";
import { defaultTo, get } from "lodash";
import { ERROR_MESSAGE } from "../constants";
import { store } from "../stores";
import { actionLogout } from "../stores/authSlice";
import { enqueueSnackbar } from "notistack";

export const instanceAxios = axios.create({
  baseURL: `//localhost:5000/`,
});

instanceAxios.defaults.headers.common["Content-Type"] = "application/json";

instanceAxios.interceptors.response.use(
  (response) => {
    if (response.data.code && +response.data.code !== 200) {
      const message = defaultTo(get(response, "data.message"), ERROR_MESSAGE);
      enqueueSnackbar(message, { variant: "error" });
      return Promise.reject(response);
    }
    return response;
  },
  (error) => {
    if (!axios.isCancel(error)) {
      const message = defaultTo(get(error, "message"), ERROR_MESSAGE);
      enqueueSnackbar(message, { variant: "error" });
    }

    if (error.response?.status === 401) {
      store.dispatch(actionLogout());
      enqueueSnackbar("Session expired. Please log in again.", {
        variant: "warning",
      });
    }
    return Promise.reject(error);
  }
);

export default function request(options: AxiosRequestConfig) {
  return instanceAxios(options);
}
