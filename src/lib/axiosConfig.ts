import axios from "axios";
const createAxiosInstance = (baseURL: string) =>
  axios.create({
    baseURL: `${process.env.NEXT_PUBLIC_APP_URL}${baseURL}`,
    timeout: 8000,
    headers: {
      "Content-Type": "application/json",
    },
  });

export default createAxiosInstance;
