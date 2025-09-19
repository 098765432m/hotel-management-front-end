"use client";

import styles from "@/styles/customer/hotel-detail/AvailableRooms.module.scss";
import MantineButton from "@/components/custom-component/MantineButton";
import { TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { BookingsDtoCreate } from "@/types/dto/booking.dto";
import ErrorCustomNotify from "@/components/custom-component/notification/ErrorCustomNotify";
import axios, { AxiosError } from "axios";
import { useState } from "react";
import { DatesRangeValue } from "@mantine/dates";
import { message } from "antd";

interface Props {
  user: {
    id: string;
    full_name: string;
    phone_number: string;
    email: string;
  } | null;
  hotelId: string;
  totalPrice: number;
  bookingRooms: {
    [roomTypeId: string]: number;
  };
  filterDateRange: DatesRangeValue;
}

export default function UserInfoBookingForm(props: Props) {
  const [bookingState, setBookingState] = useState<{
    status: "ERROR";
    message: string;
  } | null>(null);

  const form = useForm<{
    fullName: string;
    phoneNumber: string;
    email: string;
  }>({
    mode: "uncontrolled",
    initialValues: {
      fullName: props.user?.full_name ?? "",
      phoneNumber: props.user?.phone_number ?? "",
      email: props.user?.email ?? "",
    },
    validate: {
      fullName: (value) =>
        value.length <= 3 ? "Họ tên phải có ít nhất 3 ký tự" : null,
      phoneNumber: (value) => {
        const phoneRegex = /^[0-9]{10}$/;
        if (!phoneRegex.test(value)) return "Số điện thoại không hợp lệ!";
      },
      email: (value) => {
        const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,3}$/;
        if (!emailRegex.test(value)) return "Email không hợp lệ!";
      },
    },
  });

  // display message
  const [messageApi, contextHolder] = message.useMessage();

  const handleSubmit = async () => {
    try {
      const formData = form.getValues();

      const filteredBookingRooms = Object.entries(props.bookingRooms)
        .filter(([roomName, roomCount]) => roomCount > 0)
        .map(([roomName, roomCount]) => [roomName, roomCount]);

      const body: BookingsDtoCreate = {
        hotelId: props.hotelId,
        bookingRoomTypeList: filteredBookingRooms,
        checkInDate: props.filterDateRange[0]!.toISOString(),
        checkOutDate: props.filterDateRange[1]!.toISOString(),
        userId: props.user?.id ?? undefined,
        fullName: formData.fullName,
        phoneNumber: formData.phoneNumber,
      };

      // await bookingsService.CreateOne(body);
      // TODO handle booking here
      await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_SERVER}/bookings/`,
        body
      );
      messageApi.success("Đặt phòng thành công!");
    } catch (error) {
      messageApi.error("Đặt phòng thất bại!");
      if (error instanceof AxiosError) {
        console.log(error.response!.data.message);
      } else {
        console.log(error);
      }
      form.reset();
    }
  };
  return (
    <>
      {contextHolder}
      <form
        className={styles.modal_form}
        onSubmit={form.onSubmit(handleSubmit)}
      >
        <TextInput
          disabled={props.totalPrice == 0}
          withAsterisk
          label="Họ và tên"
          placeholder="Họ và tên"
          key={form.key("fullName")}
          {...form.getInputProps("fullName")}
        ></TextInput>
        <TextInput
          disabled={props.totalPrice == 0}
          withAsterisk
          label="Số điện thoại"
          placeholder="Số điện thoại"
          key={form.key("phoneNumber")}
          {...form.getInputProps("phoneNumber")}
        ></TextInput>
        <TextInput
          disabled={props.totalPrice == 0}
          withAsterisk
          label="Email"
          placeholder="Email"
          key={form.key("email")}
          {...form.getInputProps("email")}
        ></TextInput>

        {props.totalPrice == 0 ? (
          <ErrorCustomNotify message="Hãy chọn phòng để đặt!"></ErrorCustomNotify>
        ) : (
          ""
        )}

        {bookingState?.status === "ERROR" ? (
          <ErrorCustomNotify message={bookingState.message}></ErrorCustomNotify>
        ) : (
          ""
        )}
        <div className={styles.modal_form_container_button}>
          <MantineButton type="submit" disabled={props.totalPrice == 0}>
            Đặt ngay
          </MantineButton>
        </div>
      </form>
    </>
  );
}
