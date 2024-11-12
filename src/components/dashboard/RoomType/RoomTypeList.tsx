"use client";

import { RoomType } from "@/types/roomTypes.interface";
import { List, Table, TableProps } from "antd";

import RoomTypeCard from "./RoomTypeCard";
import RoomTypeForm from "./RoomTypeForm";
import useSWR from "swr";
import { axiosCustomFetcher } from "@/lib/fetcher";

interface Props {
  hotelId: string;
}

export default function RoomTypeList({ hotelId }: Props) {
  //   const columns: TableProps = [
  //     {
  //         title: 'Tên loại',
  //         key: 'name',
  //         đataIndex: 'name',
  //     },
  //     {
  //         title: 'Giá',
  //         key: 'price',
  //         đataIndex: 'price',
  //     },
  //     {
  //         title: 'Giá',
  //         key: 'price',
  //         đataIndex: 'price',
  //     }
  //   ];

  // const data = RoomTypes.map((roomType: RoomType, index: number) => {
  //   return {
  //     key: index,
  //     name: roomType.name,
  //     price: roomType.price,
  //     images: roomType.images,
  //   };
  // });
  const {
    data: roomTypes,
    isLoading: isRoomTypesLoading,
    error: isRoomTypesError,
    mutate: roomTypeMutate,
  } = useSWR(`/api/roomTypes/hotel/${hotelId}`, axiosCustomFetcher);

  return (
    <>
      <div className="flex justify-center text-2xl font-semibold">
        Danh sách phòng
      </div>
      <List>
        {roomTypes
          ? roomTypes.map((roomType: RoomType, index: number) => {
              return (
                <List.Item key={index}>
                  <RoomTypeCard
                    RoomType={roomType}
                    mutate={roomTypeMutate}
                  ></RoomTypeCard>
                </List.Item>
              );
            })
          : "Khong co"}
      </List>
    </>
  );
}
