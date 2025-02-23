"use client";

import styles from "@/styles/dashboard/booking/BookingPage.module.scss";
import CardDefault from "@/components/custom-component/CardDefault";
import CustomTable from "@/components/custom-component/CustomTable";
import MantineDatePicker from "@/components/custom-component/date-picker/MantineDatePicker";
import { axiosCustomFetcher } from "@/lib/fetcher";
import { RootState } from "@/state/store";
import { DateValue } from "@mantine/dates";
import { Button, DatePicker, Form, Input, Modal, Select } from "antd";
import dayjs from "dayjs";
import { useState } from "react";
import { useSelector } from "react-redux";
import useSWR from "swr";
import CustomPagination from "@/components/custom-component/CustomPagination";
import { Prisma } from "@prisma/client";
export default function BookingPage() {
  const authInfo = useSelector((state: RootState) => state.auth.authInfo);
  const [isAddModalOpen, setAddModalOpen] = useState(false);
  const [filterDate, setFilterDate] = useState<DateValue | null>(null);
  const [selectedRoomTypeId, setSelectedRoomTypeId] = useState<string | null>(
    null
  );

  const { data: bookings } = useSWR(
    filterDate != null
      ? `/api/bookings/hotel/${
          authInfo!.hotelId
        }?date=${filterDate?.toISOString()}`
      : null,
    axiosCustomFetcher
  );

  const { data: roomTypes } = useSWR<
    Prisma.RoomTypeGetPayload<{
      include: null;
    }>[]
  >(
    bookings && bookings.length > 0
      ? `/api/roomTypes/hotel/${authInfo!.hotelId}`
      : null,
    axiosCustomFetcher
  );

  const { data: rooms } = useSWR<
    Prisma.RoomGetPayload<{ select: { id: true; name: true } }>[]
  >(
    () =>
      `/api/rooms/hotel/${authInfo!.hotelId}/roomType/${selectedRoomTypeId}`,
    axiosCustomFetcher
  );

  return (
    <>
      <div className={styles.booking_page_container}>
        <CardDefault>
          <div className={styles.booking_table_container}>
            <div className={styles.booking_table_heading}>Đặt phòng</div>
            <div className="w-64">
              <MantineDatePicker
                valueFormat="DD/MM/YYYY"
                placeholder="DD/MM/YYYY"
                onChange={(value) => {
                  setFilterDate(value as DateValue);
                  console.log(value);
                }}
              />
              {/* <Button type="primary">Tìm kiếm</Button> */}
            </div>
            <Button type="primary" onClick={() => setAddModalOpen(true)}>
              +
            </Button>
            <CustomTable>
              <thead>
                <tr>
                  <th>Tên khách hàng</th>
                  <th>Phòng</th>
                  <th>Loại phòng</th>
                  <th>Ngày đặt</th>
                  <th>Ngày trả</th>
                  <th>Trạng thái</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {bookings && bookings.length > 0 ? (
                  bookings.map((booking: any) => (
                    <tr>
                      <td>
                        {booking.user_id == null
                          ? booking.full_name
                          : booking.user.full_name}
                      </td>
                      <td>{booking.room.name}</td>
                      <td>{booking.room.room_type.name}</td>
                      <td>
                        {dayjs(booking.check_in_date).format("DD-MM-YYYY")}
                      </td>
                      <td>
                        {dayjs(booking.check_out_date).format("DD-MM-YYYY")}
                      </td>
                      <td>{booking.status}</td>
                      <td>EDIT DELETE</td>
                    </tr>
                  ))
                ) : (
                  <></>
                )}
              </tbody>
            </CustomTable>
            <CustomPagination currentPage={1} totalPage={10}></CustomPagination>
          </div>
        </CardDefault>
      </div>
      <Modal
        title="Thêm khách hàng"
        open={isAddModalOpen}
        onClose={() => setAddModalOpen(false)}
        onCancel={() => setAddModalOpen(false)}
      >
        <Form
          labelAlign="left"
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 18 }}
          onFinish={(val) => console.log(val)}
        >
          <Form.Item name={`add_fullName`} label="Tên khách hàng">
            <Input></Input>
          </Form.Item>
          <Form.Item name={`add_phoneNumber`} label="Số điện thoại">
            <Input></Input>
          </Form.Item>
          <Form.Item name={`add_email`} label="Email">
            <Input></Input>
          </Form.Item>
          <Form.Item name={`add_roomTypeId`} label="Loại phòng">
            <Select>
              {roomTypes && roomTypes.length > 0 ? (
                roomTypes.map((roomType) => {
                  return (
                    <Select.Option key={roomType.id} value={roomType.id}>
                      {roomType.name}
                    </Select.Option>
                  );
                })
              ) : (
                <></>
              )}
            </Select>
          </Form.Item>
          <Form.Item name={`add_roomId`} label="Phòng">
            <Select>
              {rooms && rooms.length > 0 ? (
                rooms.map((room) => (
                  <Select.Option key={room.id} value={room.id}>
                    {room.name}
                  </Select.Option>
                ))
              ) : (
                <></>
              )}
            </Select>
          </Form.Item>
          <Form.Item name={`add_dateBooking`} label="Ngày đặt">
            <DatePicker.RangePicker
              format={{ format: "DD-MM-YYYY", type: "mask" }}
            ></DatePicker.RangePicker>
          </Form.Item>
          <Form.Item name={`add_status`} label="Trạng thái">
            <Select></Select>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}
