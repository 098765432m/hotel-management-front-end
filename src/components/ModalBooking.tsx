"use client";
import { Booking } from "@/types/booking.interface";
import { Modal } from "antd";

interface Props {
  booking: Booking;
  isModalOpen: boolean;
}

export default function ModalBooking({ isModalOpen = false, booking }: Props) {
  return (
    <Modal open={isModalOpen}>
      <p>Some contents...</p>
      <p>Some contents...</p>
      <p>Some contents...</p>
    </Modal>
  );
}
