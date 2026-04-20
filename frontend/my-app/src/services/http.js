import axios from "axios"

// Nó sẽ ưu tiên lấy link từ .env.local trước, nếu không có mới lấy origin
const base = import.meta.env.VITE_API_BASE_URL;

const axiosClient = axios.create({
  baseURL: base ? base + "/api" : window.location.origin + "/api",
  timeout: 60000,
  headers: {
    "Content-Type": "application/json"
  }
});

export default axiosClient