"use client";

import CardDefault from "@/components/CardDefault";
import CustomTable from "@/components/custom-component/CustomTable";
import { axiosCustomFetcher } from "@/lib/fetcher";
import { Hotel } from "@/types/hotel.interface";
import { Table } from "@mantine/core";
import useSWR from "swr";
import EmptyData from "@/components/custom-component/EmptyData";

interface Props {
  hotel: Hotel;
}

export default function AvailableRooms({ hotel }: Props) {
  return (
    <CardDefault>
      <CustomTable>
        <thead>
          <tr>
            <th>Loại phòng</th>
            <th>Số lượng khách</th>
            <th>Giá</th>
            <th>Chọn phòng</th>
            <th>Tổng</th>
          </tr>
        </thead>
        {hotel.room_types != null && hotel.room_types.length > 0 ? (
          <tbody>
            <tr>
              <th>Phong don</th>
              <th>2</th>
              <th>20.000.000d</th>
              <th>2</th>
              <th rowSpan={0}>40.000.000d</th>
            </tr>
            <tr>
              <th>Phong don</th>
              <th>2</th>
              <th>20.000.000d</th>
              <th>2</th>
            </tr>
            <tr>
              <th>Phong don</th>
              <th>2</th>
              <th>20.000.000d</th>
              <th>2</th>
            </tr>
          </tbody>
        ) : (
          <tbody>
            <tr>
              <th rowSpan={3} colSpan={5}>
                <EmptyData></EmptyData>
              </th>
            </tr>
            <tr></tr>
            <tr></tr>
          </tbody>
        )}
      </CustomTable>
    </CardDefault>
  );
}
