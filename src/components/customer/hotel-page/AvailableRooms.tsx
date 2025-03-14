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
import { forwardRef, useMemo, useReducer, useState } from "react";
import { NumberToMoneyFormat } from "@/utils/helpers";
import { useDisclosure, useScrollIntoView } from "@mantine/hooks";
import { useForm } from "@mantine/form";
import UserInfoBookingForm from "./UserInfoBookingForm";
import { redirect, useRouter, useSearchParams } from "next/navigation";
import MantineDatePicker from "@/components/custom-component/date-picker/MantineDatePicker";
import dayjs, { Dayjs } from "dayjs";
import { DatePickerType, DatesRangeValue, DateValue } from "@mantine/dates";
import useSWR from "swr";
import { axiosCustomFetcher } from "@/lib/swr";
import { GetRoomTypeBookingDtoResponse } from "@/types/dto/room-types.dto";
import { Prisma } from "@prisma/client";
import MantineLoading from "@/components/custom-component/loading/MantineLoading";
import MantineModal from "@/components/custom-component/modal/MantineModal";
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

const AvailableRooms = forwardRef<HTMLDivElement, Props>(
  ({ hotel }: Props, ref) => {
    const [opened, { open, close }] = useDisclosure(false);

    // get query params
    const filterDateRangeQuery = useSearchParams().get("filterDateRange");
    const initialFilterDateRange: DatesRangeValue | [null, null] =
      filterDateRangeQuery
        ? ((
            JSON.parse(decodeURIComponent(filterDateRangeQuery)) as [
              string,
              string
            ]
          ).map((date) => (date ? new Date(date) : null)) as DatesRangeValue)
        : [null, null];
    const [filterDateRange, setFilterDateRange] = useState<
      DatesRangeValue | [null, null]
    >(initialFilterDateRange);
    console.log(filterDateRange);

    // Fetch Available room
    const {
      data: availableRoomTypes,
      isValidating: isAvailableRoomTypesValidating,
    } = useSWR(
      () =>
        hotel && filterDateRange
          ? `/api/roomTypes/hotel/${
              hotel.id
            }/booking?filterDateRange=${encodeURIComponent(
              JSON.stringify(
                filterDateRange.map((date) => date?.toISOString() ?? null)
              )
            )}`
          : null,
      axiosCustomFetcher,
      {
        revalidateOnFocus: false,

        revalidateOnReconnect: false,
      }
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

    const countDays = useMemo(() => {
      return filterDateRange && filterDateRange[0] && filterDateRange[1]
        ? dayjs(filterDateRange[1]).diff(dayjs(filterDateRange[0]), "day")
        : 0;
    }, [filterDateRange]);

    const totalPrice = useMemo(
      () =>
        NumberToMoneyFormat(
          hotel.room_types?.reduce((sum, roomType) => {
            const count =
              bookingRooms && hotel.room_types != null
                ? bookingRooms[roomType.name]
                : 0;
            return sum + count * roomType.price * countDays;
          }, 0)
        ),
      [bookingRooms, hotel.room_types, countDays]
    );

    return (
      <div ref={ref}>
        <CardDefault className={styles.available_rooms_container}>
          <div className={styles.available_rooms_heading}>Tra cứu phòng </div>
          <div className={styles.filter_control}>
            <MantineDatePicker
              minDate={new Date()}
              type="range"
              placeholder="Chọn ngày tra cứu"
              defaultValue={[null, null]}
              onChange={(value: DatesRangeValue | DateValue | Date[]) => {
                if (Array.isArray(value) && value.length === 2)
                  setFilterDateRange(value as DatesRangeValue);
                else {
                  setFilterDateRange([null, null]);
                }
              }}
            ></MantineDatePicker>
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

            <tbody>
              {isAvailableRoomTypesValidating ? (
                <tr>
                  <td rowSpan={3} colSpan={5}>
                    <MantineLoading></MantineLoading>
                  </td>
                </tr>
              ) : availableRoomTypes?.length > 0 ? (
                availableRoomTypes.map(
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
                          return room.bookings?.length > 0;
                        })
                          ? "opacity-35"
                          : ""
                      } `}
                    >
                      <td>{roomType.name}</td>
                      <td>2</td> {/* Chỉnh lại số phòng có thể đặt */}
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
                            <MantineButton onClick={open}>
                              Đặt ngay
                            </MantineButton>
                          </div>
                        </td>
                      )}
                    </tr>
                  )
                )
              ) : (
                <tr>
                  <td rowSpan={3} colSpan={5}>
                    <EmptyData></EmptyData>
                  </td>
                </tr>
              )}
            </tbody>
          </CustomTable>
        </CardDefault>
        <MantineModal opened={opened} onClose={close} title="Đặt phòng">
          {filterDateRange &&
            filterDateRange.length === 2 &&
            filterDateRange[0] &&
            filterDateRange[1] &&
            bookingRooms && (
              <UserInfoBookingForm
                hotelId={hotel.id}
                totalPrice={parseInt(totalPrice)}
                bookingRooms={bookingRooms}
                filterDateRange={filterDateRange}
              ></UserInfoBookingForm>
            )}
        </MantineModal>
      </div>
    );
  }
);

export default AvailableRooms;
