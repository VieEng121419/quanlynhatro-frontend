import axios from "axios";
import { toast } from "sonner"; // Xài con hàng Sonner có sẵn trong package.json của mày

export const axiosClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api",
  headers: {
    "Content-Type": "application/json",
  },
});

axiosClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const backendMessage = error.response?.data?.message;

    if (error.response?.status === 400) {
      toast.error(backendMessage || "Dữ liệu nhập vào không hợp lệ!");
    } else {
      toast.error("Đã có lỗi hệ thống xảy ra. Vui lòng thử lại sau!");
    }

    return Promise.reject(error);
  }
);
