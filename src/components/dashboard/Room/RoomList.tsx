"use client";

import styles from "@/styles/dashboard/room/Room.module.scss";
import CardDefault from "@/components/custom-component/CardDefault";
import useSWR from "swr";
import { axiosCustomFetcher } from "@/lib/swr";
import { useSelector } from "react-redux";
import { RootState } from "@/state/store";
import RoomCard from "./RoomCard";
import { RoomHotelListApiResponse } from "@/types/dto/room.dto";
import AntdPagination from "@/components/custom-component/pagination/AntdPagination";

export default function RoomList() {
  const authInfo = useSelector((state: RootState) => state.auth.authInfo);

  const { data: rooms } = useSWR<RoomHotelListApiResponse>(
    () => `/api/rooms/hotel/${authInfo!.hotelId}?pageSize=6`,
    axiosCustomFetcher
  );

  const { data: roomTypes } = useSWR(
    () => `/api/roomTypes/hotel/${authInfo!.hotelId}`,
    axiosCustomFetcher
  );

  if (rooms && rooms.success)
    return (
      <CardDefault>
        <div className={styles.room_list_container}>
          <div className={styles.room_list_heading}>Danh sách phòng</div>
          <div className={styles.room_list}>
            {rooms.data.rooms.map((room, index: number) => (
              <RoomCard
                hotelId={room.hotel_id}
                roomId={room.id}
                roomTypes={roomTypes}
                key={index}
              ></RoomCard>
            ))}
          </div>
          {/* <AntdPagination></AntdPagination> */}
        </div>
      </CardDefault>
    );
}
