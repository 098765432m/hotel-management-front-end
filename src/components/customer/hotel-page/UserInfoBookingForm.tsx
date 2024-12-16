"use client";

import styles from "@/styles/customer/hotel-detail/AvailableCard.module.scss";
import MantineButton from "@/components/custom-component/MantineButton";
import { TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import bookingsService from "@/services/bookings.service";
import { BookingsDtoCreate } from "@/types/dto/booking.dto";

interface Props {
  room_id: string;
}

export default function UserInfoBookingForm(props: Props) {
  const form = useForm<{
    fullName: string;
    phoneNumber: string;
    email: string;
  }>({
    mode: "uncontrolled",
  });

  const handleSubmit = async (values: any) => {
    console.log(form.getValues());

    // const body: BookingsDtoCreate = {
    //   room_id: ,
    //   check_in_date: ,
    //   check_out_date: ,
    //   user_id: ,
    //   fullName: ,
    //   phoneNumber: ,
    //   email: ,
    // }

    // await bookingsService.CreateOne(form.getValues());
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
