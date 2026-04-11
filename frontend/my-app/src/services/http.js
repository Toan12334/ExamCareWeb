import axios from "axios"

const axiosClient = axios.create({
  baseURL: window.location.origin + "/api",
  timeout: 60000,
  headers: {
    "Content-Type": "application/json"
  }
})

export default axiosClient