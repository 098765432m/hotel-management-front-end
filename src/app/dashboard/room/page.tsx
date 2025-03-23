"use client";

import styles from "@/styles/dashboard/room/Room.module.scss";
import RoomForm from "@/components/dashboard/Room/RoomForm";
import RoomList from "@/components/dashboard/Room/RoomList";
import { useSelector } from "react-redux";
import { RootState } from "@/state/store";
import useCustomSWRInfinite from "@/hooks/use-swr-infinite";
import { RoomHotelListApiResponse } from "@/types/dto/room.dto";
export default function RoomPage() {
  const authInfo = useSelector((state: RootState) => state.auth.authInfo);
  const { mutate: roomMutate } = useCustomSWRInfinite<RoomHotelListApiResponse>(
    authInfo?.hotelId ? `/api/rooms/hotel/${authInfo!.hotelId}?limit=6` : null
  );

  return (
    <div className={styles.room_container}>
      <RoomForm roomMutate={roomMutate}></RoomForm>
      <RoomList hotelId={authInfo?.hotelId ?? null}></RoomList>
    </div>
  );
}
