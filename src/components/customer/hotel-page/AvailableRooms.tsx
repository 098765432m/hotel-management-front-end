"use client";

import styles from "@/styles/customer/hotel-detail/AvailableCard.module.scss";
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
interface Props {
  hotel: Hotel;
  // check_in_date: string;
  // check_out_date: string;
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
  const router = useRouter();
  const [opened, { open, close }] = useDisclosure(false);

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

  const totalValue = useMemo(
    () =>
      NumberToMoneyFormat(
        hotel.room_types?.reduce((sum, roomType) => {
          const count = bookingRooms != null ? bookingRooms[roomType.name] : 0;
          return sum + count * roomType.price;
        }, 0)
      ),
    [bookingRooms]
  );

  // get query params
  const check_in_date = useSearchParams().get("check_in_date") ?? null;
  const check_out_date = useSearchParams().get("check_out_date") ?? null;

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
            {hotel.room_types.map((roomType, index: number) => (
              <tr key={index}>
                <td>{roomType.name}</td>
                <td>2</td>
                <td>{NumberToMoneyFormat(roomType.price)} Đ</td>
                <td>
                  <NumberInput
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
                            typeof value == "string" ? parseInt(value) : value,
                        },
                      })
                    }
                  ></NumberInput>
                </td>
                {index === 0 && (
                  <td rowSpan={0}>
                    <div className={styles.booking_control}>
                      {totalValue} Đ
                      <MantineButton
                        onClick={
                          parseInt(totalValue) > 0
                            ? open
                            : () => router.push("/")
                        }
                      >
                        Đặt ngay
                      </MantineButton>
                    </div>
                  </td>
                )}
              </tr>
            ))}
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
            booking_rooms={bookingRooms}
            check_in_date={check_in_date}
            check_out_date={check_out_date}
          ></UserInfoBookingForm>
        )}
      </Modal>
    </CardDefault>
  );
}
