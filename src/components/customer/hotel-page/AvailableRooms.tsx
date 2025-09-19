"use client";

import styles from "@/styles/customer/hotel-detail/AvailableRooms.module.scss";
import CardDefault from "@/components/custom-component/CardDefault";
import CustomTable from "@/components/custom-component/CustomTable";
import { Hotel } from "@/types/hotel.interface";
import EmptyData from "@/components/custom-component/EmptyData";
import MantineButton from "@/components/custom-component/MantineButton";
import { NumberInput } from "@mantine/core";
import { forwardRef, useEffect, useMemo, useReducer, useState } from "react";
import { NumberToMoneyFormat } from "@/utils/helpers";
import { useDisclosure, useScrollIntoView } from "@mantine/hooks";
import UserInfoBookingForm from "./UserInfoBookingForm";
import { useSearchParams } from "next/navigation";
import MantineDatePicker from "@/components/custom-component/date-picker/MantineDatePicker";
import dayjs, { Dayjs } from "dayjs";
import { DatesRangeValue, DateValue } from "@mantine/dates";
import useSWR from "swr";
import { axiosCustomFetcher } from "@/lib/swr";
import MantineLoading from "@/components/custom-component/loading/MantineLoading";
import MantineModal from "@/components/custom-component/modal/MantineModal";
import { RootState } from "@/state/store";
import { useSelector } from "react-redux";
import useSWRImmutable from "swr/immutable";
import { formatDateToYYYYMMDD } from "@/utils/dayjs";

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

    case "RESET_ROOM_COUNT":
      if (state != null)
        return {
          ...(Object.fromEntries(
            Object.keys(state).map((key) => [key, 0])
          ) as BookingState),
        };

    default:
      return state;
  }
}

interface AvailableRoomType {
  id: string;
  name: string;
  price: number;
  hotel_id: string;
  images: {
    id: string;
    public_id: string;
    format: string;
    room_type_id: string;
  }[];
  number_of_available_rooms: number;
}

const AvailableRooms = forwardRef<HTMLDivElement, Props>(
  ({ hotel }: Props, ref) => {
    console.log("Hotel in head: ", hotel);

    const [opened, { open, close }] = useDisclosure(false);

    const authId = useSelector((state: RootState) => state.auth.authInfo?.id);

    // Get query params
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

    // Fetch thông tin người dùng
    const { data: userResult } = useSWRImmutable<ApiResponse<any>>(
      () => `${process.env.NEXT_PUBLIC_BACKEND_SERVER}/api/users/${authId}`,
      axiosCustomFetcher
    );

    const user:
      | {
          id: string;
          username: string;
          email: string;
          phoneNumber: string;
          fullName: string;
          role: string;
        }
      | undefined = userResult
      ? {
          id: userResult.result.id,
          username: userResult.result.username,
          email: userResult.result.email,
          phoneNumber: userResult.result.phone_number,
          fullName: userResult.result.full_name,
          role: userResult.result.role,
        }
      : undefined;

    console.log("User: ", user);

    // Fetch Những phòng AVAILABLE
    const {
      data: availableRoomTypesResult,
      isValidating: isAvailableRoomTypesResultValidating,
    } = useSWR<ApiResponse<AvailableRoomType[]>>(
      () =>
        hotel && filterDateRange
          ? `${process.env.NEXT_PUBLIC_BACKEND_SERVER}/api/hotels/${
              hotel.id
            }/available-room-types?check_in=${formatDateToYYYYMMDD(
              dayjs(filterDateRange[0])
            )}&check_out=${formatDateToYYYYMMDD(dayjs(filterDateRange[1]))}`
          : null,
      axiosCustomFetcher,
      {
        revalidateOnFocus: false,
        revalidateOnReconnect: false,
      }
    );

    const availableRoomTypes = availableRoomTypesResult?.result;

    const initialBookingState: BookingState | null = availableRoomTypes
      ? availableRoomTypes.reduce(
          (state, roomType) => ({
            ...state,
            [roomType.name]: 0,
          }),
          {}
        )
      : null;

    //Quan ly State cua cac phong duoc booking
    const [bookingRooms, dispatchBookingRooms] = useReducer(
      bookingReducer,
      initialBookingState
    );

    console.log("Watched Booking rooms: ", bookingRooms);

    //Tinh so ngay
    const countDays = useMemo(() => {
      return filterDateRange && filterDateRange[0] && filterDateRange[1]
        ? dayjs(filterDateRange[1]).diff(dayjs(filterDateRange[0]), "day") + 1
        : 0;
    }, [filterDateRange]);

    //Tinh tong gia tien voi so phong, loai phong va so ngay
    const totalPrice = useMemo(() => {
      console.log("Recalculating total price...");
      console.log("AvailableRoomTypes: ", availableRoomTypes);
      console.log("BookingRooms: ", bookingRooms);
      console.log("CountDays: ", countDays);

      return (
        availableRoomTypes?.reduce((sum, roomType) => {
          const count =
            bookingRooms && bookingRooms[roomType.name]
              ? bookingRooms[roomType.name]
              : 0;
          console.log(
            `Calculating for room type ${roomType.name}: count = ${count}, price = ${roomType.price}`
          );

          return sum + count * roomType.price * countDays;
        }, 0) ?? 0
      );
    }, [bookingRooms, countDays, filterDateRange]);

    console.log("Watched total price: ", totalPrice);

    useEffect(() => {
      dispatchBookingRooms({ type: "RESET_ROOM_COUNT" });
    }, [filterDateRange]);

    return (
      <div ref={ref}>
        <CardDefault className={styles.available_rooms_container}>
          <div className={styles.available_rooms_heading}>Tra cứu phòng </div>
          <div className={styles.filter_control_container}>
            <label htmlFor={"filterDateRange"}>Chọn ngày tra cứu</label>
            <MantineDatePicker
              id="filterDateRange"
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
              className={styles.filter_date_range_input}
            ></MantineDatePicker>
          </div>
          <CustomTable>
            <thead>
              <tr>
                <th>Loại phòng</th>
                <th>Giá</th>
                <th>Còn trống</th>
                <th>Chọn phòng</th>
                <th>Tổng</th>
              </tr>
            </thead>

            <tbody>
              {isAvailableRoomTypesResultValidating ? (
                <tr>
                  <td rowSpan={3} colSpan={5}>
                    <MantineLoading></MantineLoading>
                  </td>
                </tr>
              ) : availableRoomTypes && availableRoomTypes.length > 0 ? (
                availableRoomTypes.map((roomType, index: number) => (
                  <tr key={roomType.id}>
                    <td>{roomType.name} </td>
                    <td>{NumberToMoneyFormat(roomType.price)} Đ</td>
                    <td>{roomType.number_of_available_rooms}</td>
                    <td>
                      <NumberInput
                        disabled={roomType.number_of_available_rooms == 0}
                        placeholder="Nhập số"
                        step={1}
                        value={
                          bookingRooms && bookingRooms[roomType.name] != null
                            ? bookingRooms[roomType.name]
                            : 0
                        }
                        min={0}
                        max={roomType.number_of_available_rooms}
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
                      <td rowSpan={0}>
                        <div className={styles.booking_control}>
                          {NumberToMoneyFormat(totalPrice)} Đ
                          <MantineButton
                            onClick={open}
                            disabled={bookingRooms == null || totalPrice == 0}
                          >
                            Đặt ngay
                          </MantineButton>
                        </div>
                      </td>
                    )}
                  </tr>
                ))
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
                user={
                  user
                    ? {
                        id: user.id,
                        full_name: user.fullName,
                        phone_number: user.phoneNumber,
                        email: user.email,
                      }
                    : null
                }
                hotelId={hotel.id}
                totalPrice={totalPrice}
                bookingRooms={bookingRooms}
                filterDateRange={filterDateRange}
              ></UserInfoBookingForm>
            )}
        </MantineModal>
      </div>
    );
  }
);

AvailableRooms.displayName = "AvailableRooms";

export default AvailableRooms;
