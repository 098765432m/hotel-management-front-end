"use client";

import styles from "@/styles/dashboard/room-type/RoomType.module.scss";
import { RoomType } from "@/types/roomTypes.interface";

import RoomTypeCard from "./RoomTypeCard";
import useSWR from "swr";
import { axiosCustomFetcher } from "@/lib/fetcher";
import EmptyData from "@/components/custom-component/EmptyData";

interface Props {
  hotelId: string;
}

export default function RoomTypeList({ hotelId }: Props) {
  const { data: roomTypes, mutate: roomTypeMutate } = useSWR(
    () => `/api/roomTypes/hotel/${hotelId}`,
    axiosCustomFetcher
  );

  return (
    <div className={styles.room_type_list_container}>
      <div className={styles.list_header}>Danh sách phòng</div>

      <div>
        {roomTypes ? (
          <div className={styles.room_type_list}>
            {roomTypes?.map((roomType: RoomType, index: number) => {
              return (
                <div key={index}>
                  <RoomTypeCard
                    RoomType={roomType}
                    mutate={roomTypeMutate}
                  ></RoomTypeCard>
                </div>
              );
            })}
          </div>
        ) : (
          <EmptyData></EmptyData>
        )}
      </div>
    </div>
  );
}
