import axiosInstance from "./axiosConfig";

export const axiosFetcher = (url: string) =>
  axiosInstance.get(url).then((res) => res.data);
