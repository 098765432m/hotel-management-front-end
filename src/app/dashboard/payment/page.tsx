"use client";

import styles from "@/styles/dashboard/payment/PaymentPage.module.scss";
import CardDefault from "@/components/custom-component/CardDefault";
import CustomTable from "@/components/custom-component/CustomTable";
import { useSelector } from "react-redux";
import { RootState } from "@/state/store";
import EmptyData from "@/components/custom-component/EmptyData";
import { Prisma, Status_Room } from "@prisma/client";
import { Button, Form, Input, InputNumber, message } from "antd";
import { useEffect, useId, useMemo, useState } from "react";
import dayjs from "dayjs";
import { convertRoomStatusToLabel } from "@/utils/helpers";
import billsService from "@/services/bills.service";
import usersService from "@/services/users.service";
import { AxiosError } from "axios";
import AntdPagination from "@/components/custom-component/pagination/AntdPagination";
import {
  RoomHotelListApiResponse,
  RoomHotelPayload,
} from "@/types/dto/room.dto";
import useCustomSWRInfinite from "@/hooks/use-swr-infinite";
import MantineLoading from "@/components/custom-component/loading/MantineLoading";

//Type Prisma include relation

export default function PaymentPage() {
  const paymentId = useId();
  const authInfo = useSelector((state: RootState) => state.auth.authInfo);
  const [paymentForm] = Form.useForm<{
    payment: {
      discount: number;
      total: number;
      note: string;
    };
  }>();

  const getKey = (pageIndex: number, previousPageData: any | null) => {
    if (previousPageData && !previousPageData.length) return null; // reached the end
    console.log("pageIndex: ", pageIndex);

    return `/api/rooms/hotel/${authInfo!.hotelId}?page=${pageIndex}&limit=${5}`; // SWR key
  };

  const {
    data: roomListResponse,
    size,
    setSize,
    isValidating: isRoomListValidating,
  } = useCustomSWRInfinite<RoomHotelListApiResponse>(
    `/api/rooms/hotel/${authInfo?.hotelId}?limit=${5}`
  );

  //Lấy tổng số phòng
  const roomData: { rooms: RoomHotelPayload[]; totalRoom: number } | null =
    roomListResponse?.[size - 1]?.success && roomListResponse?.[size - 1]?.data
      ? (roomListResponse[size - 1].data as {
          rooms: RoomHotelPayload[];
          totalRoom: number;
        })
      : null;

  console.log("rooms", roomListResponse);

  // Hiển thị Message
  const [messageApi, contextHolder] = message.useMessage();

  const successPopUp = (successMessage: string) => {
    messageApi.open({
      type: "success",
      content: successMessage,
    });
  };

  const errorPopUp = (errorMessage: string) => {
    messageApi.open({
      type: "error",
      content: errorMessage,
    });
  };

  const [discount, setDiscount] = useState<number>(0);

  const [selectedRoom, setSelectedRoom] = useState<RoomHotelPayload | null>(
    null
  );

  // Tính số ngày thuê phòng
  const dateCount = useMemo(() => {
    if (selectedRoom && selectedRoom.status_room === Status_Room.OCCUPIED) {
      return dayjs(selectedRoom.current_booking!.check_out_date).diff(
        selectedRoom.current_booking!.check_in_date,
        "day"
      );
    }

    return 0;
  }, [selectedRoom]);

  // Tính tổng tiền
  const total = useMemo(() => {
    if (selectedRoom && selectedRoom.status_room === Status_Room.OCCUPIED) {
      return selectedRoom.room_type.price * dateCount - discount;
    }

    return 0;
  }, [discount, selectedRoom, dateCount]);

  // Handle Start

  async function handlePayment() {
    try {
      const formData = paymentForm.getFieldsValue(["payment"]);

      if (selectedRoom && selectedRoom.current_booking) {
        const staff: Prisma.UserGetPayload<null> = await usersService.GetOne(
          authInfo!.id
        );

        const result: any = await billsService.createOneDashboard({
          hotel_name: authInfo!.hotelId as string,
          booking_id: selectedRoom.current_booking.id,
          room_name: selectedRoom.name,
          room_type_id: selectedRoom.room_type_id,
          room_type_name: selectedRoom.room_type.name,
          guest_name: selectedRoom.current_booking.full_name,
          guest_phone: selectedRoom.current_booking.phone_number,
          staff_billed_name: staff.full_name,
          discount: discount,
          total_price: total,
          note: formData.note,
          check_in_date: dayjs(
            selectedRoom.current_booking.check_in_date
          ).toISOString(),
          check_out_date: dayjs(
            selectedRoom.current_booking.check_out_date
          ).toISOString(),
        });

        if (result.success) {
          successPopUp(`Thanh toán phòng ${selectedRoom.name} thành công!`);
          setSelectedRoom(null);
          paymentForm.resetFields();
        }
      }
    } catch (error) {
      console.error(error);
      if (error instanceof AxiosError) errorPopUp(error.message);
      else errorPopUp("Lỗi thanh toán!");
    }
  }

  // Handle End

  // Set tổng tiền vào form
  useEffect(() => {
    if (selectedRoom && selectedRoom.status_room === Status_Room.OCCUPIED)
      paymentForm.setFieldsValue({
        payment: {
          total: total,
          discount: discount,
          note: "",
        },
      });
  }, [total, discount, paymentForm]);

  // Set giá trị mặc định cho form
  useEffect(() => {
    if (selectedRoom && selectedRoom.status_room !== Status_Room.OCCUPIED) {
      paymentForm.setFieldsValue({
        payment: {
          discount: 0,
          total: 0,
          note: "",
        },
      });
    }
  }, [selectedRoom, paymentForm]);

  return (
    <>
      {contextHolder}
      <div className={styles.payment_page_container}>
        <CardDefault>
          <Form form={paymentForm} onFinish={handlePayment} layout="vertical">
            <div className={styles.payment_panel_container}>
              <div className={styles.payment_panel_heading}>Thanh toán</div>
              <div className={styles.payment_input_group}>
                <label htmlFor={`room-payment-${paymentId}`}>Phòng</label>
                <Input
                  readOnly
                  value={selectedRoom?.name}
                  id={`room-payment-${paymentId}`}
                ></Input>
              </div>
              <div className={styles.payment_input_group}>
                <label htmlFor={`room-type-payment-${paymentId}`}>Loại</label>
                <Input
                  readOnly
                  value={selectedRoom?.room_type.name}
                  id={`room-type-payment-${paymentId}`}
                ></Input>
              </div>
              <div className={styles.payment_input_group}>
                <label htmlFor={`client-full-name-payment-${paymentId}`}>
                  Khách hàng
                </label>
                <Input
                  id={`client-full-name-payment-${paymentId}`}
                  readOnly
                  value={selectedRoom?.current_booking?.full_name as string}
                ></Input>
              </div>
              <div className={styles.payment_input_group}>
                <label htmlFor={`price-payment-${paymentId}`}>Giá</label>
                <Input
                  readOnly
                  value={selectedRoom?.room_type.price}
                  id={`price-payment-${paymentId}`}
                ></Input>
              </div>
              <div className={styles.payment_input_group}>
                <label htmlFor={`check-in-date-${paymentId}`}>Nhận phòng</label>
                <Input
                  id={`check-in-date-${paymentId}`}
                  readOnly
                  value={
                    selectedRoom?.current_booking?.check_in_date
                      ? dayjs(
                          selectedRoom.current_booking.check_in_date
                        ).format("DD-MM-YYYY")
                      : ""
                  }
                ></Input>
              </div>
              <div className={styles.payment_input_group}>
                <label htmlFor={`check-out-date-${paymentId}`}>Trả phòng</label>
                <Input
                  id={`check-out-date-${paymentId}`}
                  readOnly
                  value={
                    selectedRoom?.current_booking?.check_in_date
                      ? dayjs(
                          selectedRoom.current_booking.check_in_date
                        ).format("DD-MM-YYYY")
                      : ""
                  }
                ></Input>
              </div>
              <div className={styles.payment_input_group}>
                <label htmlFor={`room-status-${paymentId}`}>Trạng thái</label>
                <Input
                  id={`room-status-${paymentId}`}
                  readOnly
                  value={
                    selectedRoom
                      ? (convertRoomStatusToLabel(
                          selectedRoom.status_room
                        ) as string)
                      : ""
                  }
                ></Input>
              </div>

              <div className={styles.price_group}>
                <div className={styles.payment_input_group}>
                  <label htmlFor={`discount-payment-${paymentId}`}>
                    Giảm giá
                  </label>
                  <Form.Item name={["payment", "discount"]} initialValue={0}>
                    <InputNumber
                      id={`discount-payment-${paymentId}`}
                      min={0}
                      max={
                        selectedRoom &&
                        selectedRoom.status_room === Status_Room.OCCUPIED
                          ? selectedRoom.room_type.price * dateCount
                          : undefined
                      }
                      step={1000}
                      value={discount}
                      onChange={(value) => setDiscount(value as number)}
                      disabled={
                        (selectedRoom &&
                          !(
                            selectedRoom.status_room === Status_Room.OCCUPIED
                          )) ??
                        true
                      }
                    ></InputNumber>
                  </Form.Item>
                </div>
                <div className={styles.payment_input_group}>
                  <label htmlFor={`payment-total-price-${paymentId}`}>
                    Tổng tiền
                  </label>
                  <Form.Item name={["payment", "total"]} initialValue={0}>
                    <InputNumber
                      id={`payment-total-price-${paymentId}`}
                      readOnly
                      min={0}
                    ></InputNumber>
                  </Form.Item>
                </div>
              </div>
              <div className={styles.payment_input_group}>
                <label htmlFor={`payment-note-${paymentId}`}>Ghi chú</label>
                <Form.Item name={["payment", "note"]}>
                  <Input.TextArea
                    id={`payment-note-${paymentId}`}
                    placeholder="Ghi chú"
                    autoSize={{ minRows: 2 }}
                  ></Input.TextArea>
                </Form.Item>
              </div>
              <div className={styles.submit_button}>
                <Button
                  htmlType="submit"
                  type="primary"
                  disabled={
                    (selectedRoom &&
                      !(selectedRoom.status_room === Status_Room.OCCUPIED)) ??
                    true
                  }
                >
                  Thanh toán
                </Button>
              </div>
            </div>
          </Form>
        </CardDefault>

        <CardDefault>
          <div className={styles.room_table_container}>
            <div className={styles.room_table_heading}>Danh sách phòng</div>
            <div className={styles.room_table_layout}>
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
                  {isRoomListValidating ? ( //Hiển thị loading state
                    <tr>
                      <td
                        rowSpan={6}
                        colSpan={4}
                        className={styles.loading_state}
                      >
                        <MantineLoading></MantineLoading>
                      </td>
                    </tr>
                  ) : roomData?.rooms && roomData.rooms.length > 0 ? (
                    roomData.rooms.map((room: RoomHotelPayload) => {
                      return (
                        <tr onClick={() => setSelectedRoom(room)} key={room.id}>
                          <td>{room.name}</td>
                          <td>{room.room_type.name}</td>
                          <td>{room.room_type.price}</td>
                          <td>{convertRoomStatusToLabel(room.status_room)}</td>
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
              <AntdPagination
                current={size}
                onChange={(value: number) => {
                  setSize(value);
                  console.log("pagination: ", value);
                }}
                total={
                  roomData && roomData.totalRoom > 0 ? roomData.totalRoom : 0
                }
              ></AntdPagination>
            </div>
          </div>
        </CardDefault>
      </div>
    </>
  );
}
