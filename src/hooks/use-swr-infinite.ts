import { axiosCustomFetcher } from "@/lib/swr";
import useSWRInfinite from "swr/infinite";

export default function useCustomSWRInfinite(key: string) {
  const { data, size, setSize, isValidating, isLoading } = useSWRInfinite(
    (pageIndex, previousPageData) => {
      // Đầu trang
      if (pageIndex === 0) return () => key;

      //Trang kế
      const isIncludeQuestion = key.includes("?");
      const isIncludePageSize = key.includes("pageSize=");

      return () =>
        `${key}${isIncludeQuestion ? "&" : "?"}page=${pageIndex}${
          isIncludePageSize
            ? ``
            : `&pageSize=${process.env.NEXT_PUBLIC_DEFAULT_PAGE_SIZE}`
        }`;
    },
    axiosCustomFetcher
  );

  return {
    data,
    size,
    setSize,
    isLoading,
    isValidating,
  };
}
