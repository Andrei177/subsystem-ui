import axios from "axios";
import { useAuthStore } from "@/features/auth/model/auth-store";

export const api = axios.create({
  baseURL: "http://localhost:8081",
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;

    if (status === 401) {
      useAuthStore.getState().logout();
    }

    return Promise.reject(error);
  },
);
