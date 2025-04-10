import { useAuthStore } from "@/state/auth/auth";
import axios from "axios";
import {
  getApplicationUrl,
  getAuthUrl,
  getCisUrl,
  getDashboardUrl,
} from "./env";

export const getApi = (base: string) => {
  let API = axios.create({
    baseURL: getCisUrl(),
    headers: {
      "Content-Type": "application/json",
    },
  });

  switch (base) {
    case "auth":
      API = axios.create({
        baseURL: getAuthUrl(),
        headers: {
          "Content-Type": "application/json",
        },
      });
      break;
    case "application":
      API = axios.create({
        baseURL: getApplicationUrl(),
        headers: {
          "Content-Type": "application/json",
        },
      });
      break;
    case "dashboard":
      API = axios.create({
        baseURL: getDashboardUrl(),
        headers: {
          "Content-Type": "application/json",
        },
      });
      break;
    default:
      API = axios.create({
        baseURL: getCisUrl(),
        headers: {
          "Content-Type": "application/json",
        },
      });
  }

  API.interceptors.request.use(function (config) {
    const token = useAuthStore.getState().token;
    config.headers.Authorization = token !== null ? `Bearer ${token}` : "";
    return config;
  });

  API.interceptors.response.use(
    function (response) {
      return response;
    },
    function (error) {
      if (error.response && error.response.status === 401) {
        useAuthStore.getState().logout();
        const url = window.location.origin;
        window.location.assign(`${url}/login`);
      }
      return Promise.reject(error);
    }
  );

  return API;
};
