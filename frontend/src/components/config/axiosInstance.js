import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:5000", // Địa chỉ backend
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // Bật chế độ gửi cookie
});
export default axiosInstance;
