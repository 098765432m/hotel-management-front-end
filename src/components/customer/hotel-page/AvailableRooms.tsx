"use client";

import styles from "@/styles/customer/hotel-detail/AvailableRooms.module.scss";
import CardDefault from "@/components/custom-component/CardDefault";
import CustomTable from "@/components/custom-component/CustomTable";
import { Hotel } from "@/types/hotel.interface";
import EmptyData from "@/components/custom-component/EmptyData";
import MantineButton from "@/components/custom-component/MantineButton";
import {
  Modal,
  Notification,
  NumberInput,
  RemoveScroll,
  TextInput,
} from "@mantine/core";
import { useMemo, useReducer, useState } from "react";
import { NumberToMoneyFormat } from "@/utils/helpers";
import { useDisclosure } from "@mantine/hooks";
import { useForm } from "@mantine/form";
import UserInfoBookingForm from "./UserInfoBookingForm";
import { redirect, useRouter, useSearchParams } from "next/navigation";
import MantineDatePicker from "@/components/custom-component/date-picker/MantineDatePicker";
import dayjs, { Dayjs } from "dayjs";
import { DatesRangeValue, DateValue } from "@mantine/dates";
import useSWR from "swr";
import { axiosCustomFetcher } from "@/lib/fetcher";
import { GetRoomTypeBookingDtoResponse } from "@/types/dto/room-types.dto";
import { Prisma } from "@prisma/client";
interface Props {
  hotel: Hotel;
}

export type BookingState = {
  [roomTypeId: string]: number;
};

type BookingAction =
  | {
      type: "SET_ROOM_COUNT";
      payload: {
        roomTypeName: string;
        count: number;
      };
    }
  | {
      type: "RESET_ROOM_COUNT";
    };

function bookingReducer(
  state: BookingState | null,
  action: BookingAction
): BookingState | null {
  switch (action.type) {
    case "SET_ROOM_COUNT":
      return {
        ...state,
        [action.payload.roomTypeName]: action.payload.count,
      };

    default:
      return state;
  }
}

export default function AvailableRooms({ hotel }: Props) {
  const [opened, { open, close }] = useDisclosure(false);

  const [filterDateRange, setFilterDateRange] =
    useState<DatesRangeValue | null>(null);

  // Convert Date to Query String

  const dateRangeQuery: string = useMemo(() => {
    return filterDateRange && filterDateRange[0] && filterDateRange[1]
      ? `${filterDateRange[0].toISOString()},${filterDateRange[1].toISOString()}`
      : "";
  }, [filterDateRange]);

  // Fetch Available room
  const { data: availableRoomTypes } = useSWR(
    () =>
      hotel && dateRangeQuery && dateRangeQuery[0] && dateRangeQuery[1]
        ? `/api/roomTypes/hotel/${hotel.id}/booking?dateRange=${dateRangeQuery}`
        : null,
    axiosCustomFetcher
  );

  const initialBookingState: BookingState | null = hotel.room_types
    ? hotel.room_types.reduce(
        (state, roomType) => ({
          ...state,
          [roomType.name]: 0,
        }),
        {}
      )
    : null;
  const [bookingRooms, dispatchBookingRooms] = useReducer(
    bookingReducer,
    initialBookingState
  );

  const totalPrice = useMemo(
    () =>
      NumberToMoneyFormat(
        hotel.room_types?.reduce((sum, roomType) => {
          const count = bookingRooms != null ? bookingRooms[roomType.name] : 0;
          return sum + count * roomType.price;
        }, 0)
      ),
    [bookingRooms, hotel.room_types]
  );

  // get query params
  const check_in_date = useSearchParams().get("check_in_date") ?? null;
  const check_out_date = useSearchParams().get("check_out_date") ?? null;

  return (
    <CardDefault className={styles.available_rooms_container}>
      <div className={styles.filter_control}>
        <MantineDatePicker
          type="range"
          valueFormat="DD/MM/YYYY"
          placeholder="Chọn ngày tra cứu"
          onChange={(value: DatesRangeValue | DateValue | Date[]) => {
            if (Array.isArray(value) && value.length === 2)
              setFilterDateRange(value as DatesRangeValue);
            else {
              setFilterDateRange(null);
            }
          }}
          // Date Cần điền vào
        ></MantineDatePicker>
        <div>{filterDateRange?.[0]?.toDateString()}</div>
        <div>{filterDateRange?.[1]?.toDateString()}</div>
      </div>
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
        {availableRoomTypes && availableRoomTypes.length > 0 ? (
          <tbody>
            {availableRoomTypes.map(
              (
                roomType: Prisma.RoomTypeGetPayload<{
                  include: {
                    rooms: {
                      include: {
                        bookings: true;
                      };
                    };
                  };
                }>,
                index: number
              ) => (
                <tr
                  key={index}
                  className={`${
                    roomType.rooms.some((room) => {
                      //Make row blur when roomType not have A Single room AVAILABLE
                      room.bookings?.length > 0;
                    })
                      ? "opacity-35"
                      : ""
                  } `}
                >
                  <td>{roomType.name}</td>
                  <td>2</td>
                  <td>{NumberToMoneyFormat(roomType.price)} Đ</td>
                  <td>
                    <NumberInput
                      disabled={roomType.rooms.length == 0}
                      placeholder="Nhập số"
                      step={1}
                      defaultValue={0}
                      min={0}
                      max={10}
                      suffix=" Phòng"
                      clampBehavior="strict"
                      onChange={(value: number | string) =>
                        dispatchBookingRooms({
                          type: "SET_ROOM_COUNT",
                          payload: {
                            roomTypeName: roomType.name,
                            count:
                              typeof value == "string"
                                ? parseInt(value)
                                : value,
                          },
                        })
                      }
                    ></NumberInput>
                  </td>
                  {index === 0 && (
                    <td rowSpan={0} className="opacity-100">
                      <div className={styles.booking_control}>
                        {totalPrice} Đ
                        <MantineButton onClick={open}>Đặt ngay</MantineButton>
                      </div>
                    </td>
                  )}
                </tr>
              )
            )}
          </tbody>
        ) : (
          <tbody>
            <tr>
              <td rowSpan={3} colSpan={5}>
                <EmptyData></EmptyData>
              </td>
            </tr>
            <tr></tr>
            <tr></tr>
          </tbody>
        )}
      </CustomTable>
      <Modal
        opened={opened}
        onClose={close}
        title="Đặt phòng"
        lockScroll={true}
      >
        {check_in_date && check_out_date && bookingRooms && (
          <UserInfoBookingForm
            hotel_id={hotel.id}
            totalPrice={parseInt(totalPrice)}
            booking_rooms={bookingRooms}
            check_in_date={check_in_date}
            check_out_date={check_out_date}
          ></UserInfoBookingForm>
        )}
      </Modal>
    </CardDefault>
  );
}
