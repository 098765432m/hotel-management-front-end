"use client";

import styles from "@/styles/dashboard/booking/BookingPage.module.scss";
import customTableStyles from "@/styles/custom-component/CustomTable.module.scss";
import CardDefault from "@/components/custom-component/CardDefault";
import CustomTable from "@/components/custom-component/CustomTable";
import MantineDatePicker from "@/components/custom-component/date-picker/MantineDatePicker";
import { axiosCustomFetcher } from "@/lib/swr";
import { RootState } from "@/state/store";
import { DateValue } from "@mantine/dates";
import {
  Button,
  DatePicker,
  Form,
  Input,
  Modal,
  Popconfirm,
  Select,
} from "antd";
import dayjs from "dayjs";
import { useState } from "react";
import { useSelector } from "react-redux";
import useSWR from "swr";
import { Prisma, Status_Booking } from "@prisma/client";
import bookingsService from "@/services/bookings.service";
import { FaTrashAlt, FaCheck } from "react-icons/fa";

import { MdEdit } from "react-icons/md";
import { AxiosError } from "axios";
import { convertBookingStatusToLabel } from "@/utils/helpers";
import EmptyData from "@/components/custom-component/EmptyData";

interface ModalBookingForm
  extends Prisma.BookingGetPayload<{
    include: {
      user: {
        select: {
          full_name: true;
        };
      };
      room: {
        select: {
          name: true;
          hotel_id: true;
          room_type: {
            select: {
              id: true;
              name: true;
              price: true;
            };
          };
        };
      };
    };
  }> {}

enum modal_form_state {
  ADD = "ADD",
  EDIT = "EDIT",
}

export default function BookingPage() {
  console.log("date", dayjs().toDate() as DateValue);

  const authInfo = useSelector((state: RootState) => state.auth.authInfo);
  const [form] = Form.useForm();
  const [modalState, setModalState] = useState<modal_form_state | null>(null);
  const [filterDate, setFilterDate] = useState<DateValue | null>(
    dayjs().startOf("day").toDate() as DateValue
  );
  const [editedBookingId, setEditedBookingId] = useState<string | null>(null);
  const [selectedRoomTypeId, setSelectedRoomTypeId] = useState<string | null>(
    null
  );

  const { data: bookings, mutate: bookingsMutate } = useSWR<ModalBookingForm[]>(
    () =>
      `/api/bookings/hotel/${
        authInfo?.hotelId
      }?date=${filterDate?.toISOString()}`,
    axiosCustomFetcher
  );
  console.log("filterDate", "authINfo", filterDate, authInfo);
  console.log("bookings", bookings);

  const { data: roomTypes } = useSWR<
    Prisma.RoomTypeGetPayload<{
      include: null;
    }>[]
  >(() => `/api/roomTypes/hotel/${authInfo?.hotelId}`, axiosCustomFetcher);

  console.log("room type: ", roomTypes);

  const { data: rooms, mutate: roomsMutate } = useSWR<
    Prisma.RoomGetPayload<{ select: { id: true; name: true } }>[]
  >(
    selectedRoomTypeId != null
      ? `/api/rooms/hotel/${authInfo?.hotelId}/roomType/${selectedRoomTypeId}`
      : null,
    axiosCustomFetcher
  );

  return (
    <>
      <div className={styles.booking_page_container}>
        <CardDefault>
          <div className={styles.booking_table_container}>
            <div className={styles.booking_table_heading}>Đặt phòng</div>
            <div className={styles.booking_control_panel}>
              <MantineDatePicker
                valueFormat="DD/MM/YYYY"
                placeholder="DD/MM/YYYY"
                value={filterDate as DateValue}
                onChange={(value) => {
                  setFilterDate(value as DateValue);
                }}
                className={styles.date_picker_input}
              />
              <Button
                type="primary"
                onClick={() => setModalState(modal_form_state.ADD)}
              >
                Thêm
              </Button>
            </div>
            <CustomTable>
              <thead>
                <tr>
                  <th>Tên khách hàng</th>
                  <th>Phòng</th>
                  <th>Loại phòng</th>
                  <th>Ngày đặt</th>
                  <th>Ngày trả</th>
                  <th>Trạng thái</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {bookings && bookings.length > 0 ? (
                  bookings.map((booking) => (
                    <tr key={booking.id}>
                      <td>
                        {booking.user_id == null
                          ? booking.full_name
                          : booking.user!.full_name}
                      </td>
                      <td>{booking.room.name}</td>
                      <td>{booking.room.room_type.name}</td>
                      <td>
                        {dayjs(booking.check_in_date).format("DD-MM-YYYY")}
                      </td>
                      <td>
                        {dayjs(booking.check_out_date).format("DD-MM-YYYY")}
                      </td>
                      <td>{convertBookingStatusToLabel(booking.status)}</td>
                      <td className={customTableStyles.control_column}>
                        <Popconfirm
                          disabled={booking.status !== Status_Booking.BOOKED}
                          placement="topRight"
                          title="Nhận phòng cho khách hàng này ?"
                          onConfirm={async () => {
                            try {
                              await bookingsService.checkInBooking(
                                booking.id,
                                booking.room_id
                              );
                            } catch (error) {
                              if (error instanceof AxiosError) {
                                alert(error.response?.data.message);
                              }
                            }
                            bookingsMutate();
                          }}
                          okText="Nhận"
                          cancelText="Không"
                        >
                          <button
                            disabled={booking.status !== Status_Booking.BOOKED}
                            className="bg-green-400 border-0 rounded-md text-white cursor-pointer disabled:bg-slate-300 hover:bg-green-500 flex items-center py-2"
                          >
                            <FaCheck></FaCheck>
                          </button>
                        </Popconfirm>
                        <button
                          onClick={async () => {
                            setModalState(modal_form_state.EDIT);
                            setEditedBookingId(booking.id);
                            form.setFieldsValue({
                              fullName: booking.full_name,
                              phoneNumber: booking.phone_number,
                              roomTypeId: booking.room.room_type.id,
                              dates: [
                                dayjs(booking.check_in_date),
                                dayjs(booking.check_out_date),
                              ],
                              status: booking.status,
                            });

                            setSelectedRoomTypeId(booking.room.room_type.id);

                            await roomsMutate();

                            form.setFieldValue(["roomId"], booking.room_id);
                          }}
                          disabled={booking.status === Status_Booking.PAID}
                          className="bg-yellow-400 border-0 rounded-md text-white cursor-pointer disabled:bg-slate-300 hover:bg-yellow-500 flex items-center py-2"
                        >
                          <MdEdit></MdEdit>
                        </button>
                        <Popconfirm
                          placement="topRight"
                          title="Bạn có chắc chắn muốn xóa?"
                          onConfirm={async () => {
                            await bookingsService.unBookingOne(
                              booking.id,
                              booking.room_id
                            );
                            bookingsMutate();
                          }}
                          okText="Có"
                          cancelText="Không"
                        >
                          <button className="bg-red-400 border-0 rounded-md text-white cursor-pointer disabled:bg-slate-300 hover:bg-red-500 flex items-center py-2">
                            <FaTrashAlt></FaTrashAlt>
                          </button>
                        </Popconfirm>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td rowSpan={3} colSpan={7}>
                      <EmptyData></EmptyData>
                    </td>
                  </tr>
                )}
              </tbody>
            </CustomTable>
          </div>
        </CardDefault>
      </div>
      <Modal
        title={modalState === modal_form_state.ADD ? "Đặt phòng" : "Chỉnh sửa"}
        open={modalState != null}
        onClose={() => {
          setModalState(null);
          form.resetFields();
        }}
        cancelText="Hủy"
        onCancel={() => {
          setModalState(null);
          form.resetFields();
        }}
        okText="Lưu"
        onOk={() => {
          form.submit();
          setModalState(null);
        }}
      >
        <Form
          form={form}
          labelAlign="left"
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 18 }}
          onFinish={async () => {
            const formData = form.getFieldsValue();
            console.log("formData", formData);

            switch (modalState) {
              case modal_form_state.ADD:
                await bookingsService.createOneDashboard(
                  authInfo!.hotelId as string,
                  {
                    roomId: formData.roomId,

                    fullName: formData.fullName,
                    phoneNumber: formData.phoneNumber,

                    checkInDate: formData.dates[0].toISOString(),
                    checkOutDate: formData.dates[1].toISOString(),
                    status: formData.status,
                  }
                );
                break;

              case modal_form_state.EDIT:
                await bookingsService.updateOneDashboard(
                  editedBookingId as string,
                  {
                    roomId: formData.roomId,
                    checkInDate: formData.dates[0].toISOString(),
                    checkOutDate: formData.dates[1].toISOString(),
                  }
                );
                break;
            }

            bookingsMutate();
            form.resetFields();
          }}
        >
          <Form.Item name={`fullName`} label="Tên khách hàng">
            <Input disabled={modalState === modal_form_state.EDIT}></Input>
          </Form.Item>
          <Form.Item name={`phoneNumber`} label="Số điện thoại">
            <Input disabled={modalState === modal_form_state.EDIT}></Input>
          </Form.Item>
          <Form.Item name={`roomTypeId`} label="Loại phòng">
            <Select
              onChange={(value) => {
                setSelectedRoomTypeId(value);
                form.setFieldValue("roomId", undefined);
              }}
            >
              {roomTypes && roomTypes.length > 0
                ? roomTypes.map((roomType) => {
                    return (
                      <Select.Option key={roomType.id} value={roomType.id}>
                        {roomType.name}
                      </Select.Option>
                    );
                  })
                : null}
            </Select>
          </Form.Item>
          <Form.Item name={`roomId`} label="Phòng">
            <Select>
              {rooms && rooms.length > 0
                ? rooms.map((room) => (
                    <Select.Option key={room.id} value={room.id}>
                      {room.name}
                    </Select.Option>
                  ))
                : null}
            </Select>
          </Form.Item>
          <Form.Item name={`dates`} label="Ngày đặt">
            <DatePicker.RangePicker
              format={{ format: "DD-MM-YYYY", type: "mask" }}
            ></DatePicker.RangePicker>
          </Form.Item>
          <Form.Item name={`status`} label="Trạng thái">
            <Select disabled={modalState === modal_form_state.EDIT}>
              {Object.values(Status_Booking).map((status) => {
                return (
                  <Select.Option key={status} value={status}>
                    {convertBookingStatusToLabel(status)}
                  </Select.Option>
                );
              })}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}
