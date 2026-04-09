import axios from "axios"

const axiosClient = axios.create({
  baseURL: window.location.origin + "/api",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json"
  }
})

export default axiosClient