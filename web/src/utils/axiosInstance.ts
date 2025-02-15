// axiosInstance.ts
import axios from "axios";
import { useAuthStore } from "../store/authStore";
import { useUserStore } from "../store/userStore";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3000/api";

const endpointsToSkipRefresh = [
  "/auth/sign-in",
  "/auth/sign-up",
  "/auth/refresh",
];

export const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

let isRefreshing = false;

let refreshSubscribers: Array<(token: string | null) => void> = [];

const refreshAccessToken = async (): Promise<string | null> => {
  console.log("🔄 refreshAccessToken() start");

  if (isRefreshing) {
    console.log("🔄 Jest już w trakcie odświeżania – dołączamy do kolejki");
    return new Promise((resolve) => {
      refreshSubscribers.push(resolve);
    });
  }

  isRefreshing = true;

  try {
    const response = await axiosInstance.post("/auth/refresh");
    const newAccessToken: string = response.data.token;

    console.log("✅ Udało się odświeżyć token:", newAccessToken);

    useAuthStore.getState().setToken(newAccessToken);

    refreshSubscribers.forEach((callback) => callback(newAccessToken));
    refreshSubscribers = [];

    return newAccessToken;
  } catch (error) {
    console.error("❌ Błąd odświeżania tokena:", error);

    refreshSubscribers.forEach((callback) => callback(null));
    refreshSubscribers = [];

    useAuthStore.getState().clearToken();
    useUserStore.getState().clearUser();

    return null;
  } finally {
    isRefreshing = false;
    console.log("🔄 refreshAccessToken() koniec");
  }
};

axiosInstance.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (
      error.response?.status === 401 &&
      endpointsToSkipRefresh.some((endpoint) =>
        originalRequest.url.includes(endpoint)
      )
    ) {
      return Promise.reject(error);
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      console.log("💥 Otrzymano 401 – spróbujmy odświeżyć token!!!");
      originalRequest._retry = true;

      const newAccessToken = await refreshAccessToken();

      if (newAccessToken) {
        console.log("♻️ Ponawiamy żądanie z nowym tokenem:", newAccessToken);
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return axiosInstance(originalRequest);
      }
      console.log("❌ Odświeżenie tokena nie powiodło się – wylogowanie");
      return Promise.reject(error);
    }
    return Promise.reject(error);
  }
);
