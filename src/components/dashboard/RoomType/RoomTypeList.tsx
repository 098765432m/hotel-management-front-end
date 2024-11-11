"use client";

import { RoomType } from "@/types/roomTypes.interface";
import { List, Table, TableProps } from "antd";

import RoomTypeCard from "./RoomTypeCard";

interface Props {
  hotelId: string;
  RoomTypes: RoomType[];
}

export default function RoomTypeList({ hotelId, RoomTypes }: Props) {
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

  const data = RoomTypes.map((roomType: RoomType, index: number) => {
    return {
      key: index,
      name: roomType.name,
      price: roomType.price,
      images: roomType.images,
    };
  });

  console.log(data);

  return (
    <>
      <div className="flex justify-center text-2xl font-semibold">
        Danh sách phòng
      </div>
      <List>
        {RoomTypes.map((roomType: RoomType, index: number) => {
          return (
            <List.Item key={index}>
              <RoomTypeCard RoomType={roomType}></RoomTypeCard>
            </List.Item>
          );
        })}
      </List>
    </>
  );
}
