import axios from "axios";
import axiosInstance from "./axiosConfig";

export const axiosFetcher = (url: string) =>
  axiosInstance.get(url).then((res) => res.data);

export const axiosCustomFetcher = (url: string) =>
  axios(url).then((res) => res.data);
