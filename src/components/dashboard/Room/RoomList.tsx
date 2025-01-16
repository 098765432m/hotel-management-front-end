"use client";

import styles from "@/styles/dashboard/room/Room.module.scss";
import CardDefault from "@/components/custom-component/CardDefault";
import useSWR from "swr";
import { axiosCustomFetcher } from "@/lib/fetcher";
import { useSelector } from "react-redux";
import { RootState } from "@/state/store";
import { Room } from "@/types/room.interface";
import { Form } from "antd";
import RoomCard from "./RoomCard";

export default function RoomList() {
  const authStore = useSelector((state: RootState) => state.auth);

  const {
    data: rooms,
    isLoading: isRoomsLoading,
    error: isRoomsError,
  } = useSWR(
    `/api/rooms/hotel/${authStore.authInfo?.hotelId}`,
    axiosCustomFetcher
  );
  const {
    data: roomTypes,
    isLoading: isRoomTypesLoading,
    error: isRoomTypesError,
  } = useSWR(
    `/api/roomTypes/hotel/${authStore.authInfo?.hotelId}`,
    axiosCustomFetcher
  );

  if (rooms)
    return (
      <CardDefault>
        <div className={styles.room_list_container}>
          <div className={styles.room_list_heading}>Danh sách phòng</div>
          <div className={styles.room_list}>
            {rooms.map((room: Room, index: number) => (
              <RoomCard
                hotelId={room.hotel_id}
                roomId={room.id}
                roomTypes={roomTypes}
                key={index}
              ></RoomCard>
            ))}
          </div>
        </div>
      </CardDefault>
    );
}
