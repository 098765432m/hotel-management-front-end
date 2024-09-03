import axios from "axios";

const axiosInstance = axios.create({
  baseURL: process.env.PUBLIC_NEXT_APP_URL,
  timeout: 8000,
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosInstance;
