import axios from "axios";

export default (baseURL: string) =>
  axios.create({
    baseURL: `${process.env.NEXT_PUBLIC_APP_URL}${baseURL}`,
    timeout: 8000,
    headers: {
      "Content-Type": "application/json",
    },
  });
