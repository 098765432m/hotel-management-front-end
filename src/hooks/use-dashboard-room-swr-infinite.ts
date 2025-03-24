import { RoomHotelListApiResponse } from "@/types/dto/room.dto";
import useCustomSWRInfinite from "./use-swr-infinite";

interface Props {
  hotelId: string;
  limit?: number;
}

export function useRoomDashboardSWRInfinite(props: Props) {
  const { data, size, setSize, mutate, isValidating, isLoading } =
    useCustomSWRInfinite<RoomHotelListApiResponse>(
      `/api/rooms/hotel/${props.hotelId}?limit=${props.limit ?? 5}`
    );

  return {
    data,
    size,
    isLoading,
    isValidating,
    setSize,
    mutate,
  };
}
