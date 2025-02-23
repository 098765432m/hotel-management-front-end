"use client";

import styles from "@/styles/dashboard/payment/PaymentPage.module.scss";
import CardDefault from "@/components/custom-component/CardDefault";
import CustomTable from "@/components/custom-component/CustomTable";
import { useSelector } from "react-redux";
import { RootState } from "@/state/store";
import useSWR from "swr";
import { axiosCustomFetcher } from "@/lib/fetcher";
import EmptyData from "@/components/custom-component/EmptyData";
import { Prisma } from "@prisma/client";
import { Button, Form, Input, Modal } from "antd";
import { useState } from "react";
import dayjs from "dayjs";

//Type Prisma include relation
type RoomWithRelation = Prisma.RoomGetPayload<{
  include: { room_type: true; bookings: true; current_booking: true };
}>;

export default function PaymentPage() {
  const authInfo = useSelector((state: RootState) => state.auth.authInfo);

  const { data: rooms } = useSWR(
    () => `/api/rooms/hotel/${authInfo!.hotelId}`,
    axiosCustomFetcher
  );

  const [selectedRoom, setSelectedRoom] = useState<RoomWithRelation | null>(
    null
  );

  return (
    <>
      <div className={styles.payment_page_container}>
        <CardDefault>
          <div className={styles.payment_panel_container}>
            <div className={styles.payment_panel_heading}>Thanh toán</div>
            Phòng<Input value={selectedRoom?.name}></Input>
            Loại<Input value={selectedRoom?.room_type.name}></Input>
            Khách hàng
            <Input
              value={selectedRoom?.current_booking?.full_name as string}
            ></Input>
            Giá<Input value={selectedRoom?.room_type.price}></Input>
            Nhận phòng
            <Input
              value={
                selectedRoom?.current_booking?.check_in_date
                  ? dayjs(selectedRoom.current_booking.check_in_date).format(
                      "DD-MM-YYYY"
                    )
                  : ""
              }
            ></Input>
            Trả phòng
            <Input
              value={
                selectedRoom?.current_booking?.check_in_date
                  ? dayjs(selectedRoom.current_booking.check_in_date).format(
                      "DD-MM-YYYY"
                    )
                  : ""
              }
            ></Input>
            <Button type="primary">Thanh toán</Button>
          </div>
        </CardDefault>

        <CardDefault>
          <div className={styles.room_table_container}>
            <div className={styles.room_table_heading}>Danh sách phòng</div>
            <CustomTable>
              <thead>
                <tr>
                  <th>Phòng </th>
                  <th>Loại</th>
                  <th>Giá</th>
                  <th>Trạng thái</th>
                </tr>
              </thead>
              <tbody>
                {rooms && rooms.length > 0 ? (
                  rooms.map((room: RoomWithRelation) => {
                    return (
                      <tr onClick={() => setSelectedRoom(room)}>
                        <td>{room.name}</td>
                        <td>{room.room_type.name}</td>
                        <td>{room.room_type.price}</td>
                        <td>{room.status_room}</td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td rowSpan={3} colSpan={4}>
                      <EmptyData></EmptyData>
                    </td>
                  </tr>
                )}
              </tbody>
            </CustomTable>
          </div>
        </CardDefault>
      </div>
      <Modal>
        <Form>
          <div>Thanh toán</div>
          <Form.Item label=""></Form.Item>
        </Form>
      </Modal>
    </>
  );
}
