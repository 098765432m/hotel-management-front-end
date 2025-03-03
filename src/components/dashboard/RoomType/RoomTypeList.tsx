"use client";

import styles from "@/styles/dashboard/room-type/RoomType.module.scss";

import RoomTypeCard from "./RoomTypeCard";
import EmptyData from "@/components/custom-component/EmptyData";
import useCustomSWRInfinite from "@/hooks/use-swr-infinite";
import { RoomTypeHotelApiResponse } from "@/types/dto/room-types.dto";
import AntdPagination from "@/components/custom-component/pagination/AntdPagination";
import CustomSpinning from "@/components/custom-component/CustomSpinning";

interface Props {
  hotelId: string | null;
}

export default function RoomTypeList({ hotelId }: Props) {
  const {
    data: roomTypeApiResponse,
    size: sizeRoomType,
    setSize: setRoomTypeSize,
    isValidating: isRoomTypeValidating,
  } = useCustomSWRInfinite<RoomTypeHotelApiResponse>(
    hotelId ? `/api/roomTypes/hotel/${hotelId}?limit=6` : null
  );

  let roomTypeData = null;
  if (
    roomTypeApiResponse &&
    roomTypeApiResponse[sizeRoomType - 1] &&
    roomTypeApiResponse[sizeRoomType - 1].success
  )
    roomTypeData = roomTypeApiResponse[sizeRoomType - 1].data;

  return (
    <div className={styles.room_type_list_container}>
      <div className={styles.list_header}>Danh sách loại phòng</div>

      <div>
        {isRoomTypeValidating ? (
          <CustomSpinning></CustomSpinning>
        ) : hotelId && roomTypeData && roomTypeData.roomTypes.length > 0 ? (
          <>
            <div className={styles.room_type_list}>
              {roomTypeData.roomTypes.map((roomType, index: number) => {
                return (
                  <div key={index}>
                    <RoomTypeCard
                      hotelId={hotelId}
                      RoomType={roomType}
                    ></RoomTypeCard>
                  </div>
                );
              })}
            </div>

            <AntdPagination
              size="default"
              current={sizeRoomType}
              onChange={(value: number) => setRoomTypeSize(value)}
              total={roomTypeData ? roomTypeData.totalRoomType : 0}
            ></AntdPagination>
          </>
        ) : (
          <EmptyData></EmptyData>
        )}
      </div>
      <div></div>
    </div>
  );
}
