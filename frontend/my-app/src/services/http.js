import axios from "axios"

// Production gọi cùng origin để Vercel chuyển tiếp API tới VPS.
// Development vẫn dùng VITE_API_BASE_URL trong file .env.
const base = import.meta.env.PROD ? "" : import.meta.env.VITE_API_BASE_URL;

const axiosClient = axios.create({
  baseURL: base ? base.replace(/\/$/, "") + "/api" : "/api",
  timeout: 1000000,
  headers: {
    "Content-Type": "application/json"
  }
});

export default axiosClient
