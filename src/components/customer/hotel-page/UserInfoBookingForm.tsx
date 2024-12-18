"use client";

import styles from "@/styles/customer/hotel-detail/AvailableCard.module.scss";
import MantineButton from "@/components/custom-component/MantineButton";
import { TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import bookingsService from "@/services/bookings.service";
import { BookingsDtoCreate } from "@/types/dto/booking.dto";
import { useSelector } from "react-redux";
import { RootState } from "@/state/store";
import { number, string } from "zod";
import { log } from "node:console";

interface Props {
  hotel_id: string;
  booking_rooms: {
    [roomTypeId: string]: number;
  };
  check_in_date: string;
  check_out_date: string;
}

export default function UserInfoBookingForm(props: Props) {
  const authStore = useSelector((state: RootState) => state.auth);
  console.log(authStore.authInfo?.id);

  const form = useForm<{
    fullName: string;
    phoneNumber: string;
    email: string;
  }>({
    mode: "uncontrolled",
  });

  const handleSubmit = async (values: any) => {
    const formData = form.getValues();

    const filtered_booking_rooms = Object.entries(props.booking_rooms)
      .filter(([roomName, roomCount]) => roomCount > 0)
      .map(([roomName, roomCount]) => [roomName, roomCount]);

    console.log(filtered_booking_rooms);

    const body: BookingsDtoCreate = {
      hotel_id: props.hotel_id,
      booking_type_list: filtered_booking_rooms,
      check_in_date: props.check_in_date,
      check_out_date: props.check_out_date,
      user_id: authStore.authInfo?.id ?? undefined,
      fullName: formData.fullName,
      phoneNumber: formData.phoneNumber,
      email: formData.email,
    };

    await bookingsService.CreateOne(body);
  };
  return (
    <form className={styles.modal_form} onSubmit={form.onSubmit(handleSubmit)}>
      <TextInput
        withAsterisk
        label="Họ và tên"
        placeholder="Họ và tên"
        key={form.key("fullName")}
        {...form.getInputProps("fullName")}
      ></TextInput>
      <TextInput
        withAsterisk
        label="Số điện thoại"
        placeholder="Số điện thoại"
        key={form.key("phoneNumber")}
        {...form.getInputProps("phoneNumber")}
      ></TextInput>
      <TextInput
        withAsterisk
        label="Email"
        placeholder="Email"
        key={form.key("email")}
        {...form.getInputProps("email")}
      ></TextInput>
      <div className={styles.modal_form_container_button}>
        <MantineButton type="submit">Đặt ngay</MantineButton>
      </div>
    </form>
  );
}
