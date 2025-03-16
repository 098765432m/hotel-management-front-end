import { axiosCustomFetcher } from "@/lib/swr";
import { ApiResponse } from "@/types/common/api-response";
import useSWRInfinite from "swr/infinite";

export default function useCustomSWRInfinite<T extends ApiResponse<any>>(
  key: string | null
) {
  const { data, size, setSize, isValidating, isLoading, mutate } =
    useSWRInfinite<T>((pageIndex, previousPageData) => {
      if (key === null) return null;

      // Đầu trang
      if (pageIndex === 0) return () => key;

      //Trang kế
      const isIncludeQuestion = key.includes("?");
      const isIncludeLimit = key.includes("limit=");

      return () =>
        `${key}${isIncludeQuestion ? "&" : "?"}page=${pageIndex}${
          isIncludeLimit
            ? ``
            : `&limit=${process.env.NEXT_PUBLIC_DEFAULT_PAGE_SIZE}`
        }`;
    }, axiosCustomFetcher);

  return {
    data,
    size,
    setSize,
    isLoading,
    isValidating,
    mutate,
  };
}
