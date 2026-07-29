import axios from "axios";
import { toast } from "sonner";

export const axiosClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor — gắn Bearer token vào mọi request
axiosClient.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

axiosClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const backendMessage = error.response?.data?.message;

    if (error.response?.status === 401) {
      // Token hết hạn hoặc không hợp lệ -> clear token, đá về login
      clearAccessToken();
      toast.error(
        backendMessage || "Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại!"
      );
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
    } else if (error.response?.status === 400) {
      toast.error(backendMessage || "Dữ liệu nhập vào không hợp lệ!");
    } else {
      toast.error("Đã có lỗi hệ thống xảy ra. Vui lòng thử lại sau!");
    }

    return Promise.reject(error);
  }
);

// ---- Token helpers ----

function getAccessToken(): string | null {
  if (typeof window === "undefined") return null; // tránh lỗi khi chạy ở server (SSR)
  return localStorage.getItem("accessToken");
}

function clearAccessToken(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem("accessToken");
}
