import axios from "axios";
import { string } from "zod";

export const axiosFetcher = async (url: string) => {
  const response = await axios.get(url);
  return response.data;
};

export const getSWRInfiniteKey = (key: string) => {
  return (pageIndex: number, prevData: any | null) => {
    console.log(pageIndex);

    if (prevData && !prevData.length) return null;

    if (key.includes("?")) return `${key}&page=${pageIndex}`;
    else return `${key}?page=${pageIndex}`;
  };
};

export const axiosCustomFetcher = (url: string) =>
  axios(url).then((res) => res.data);
