"use client";

import styles from "@/styles/dashboard/room/Room.module.scss";

import CardDefault from "@/components/custom-component/CardDefault";
import { Button, Form, Input, Select } from "antd";
import { axiosFetcher } from "@/lib/swr";
import useSWR, { mutate } from "swr";
import roomsServices from "@/services/rooms.services";
import { useSelector } from "react-redux";
import { RootState } from "@/state/store";
import { RoomDtoCreate } from "@/types/dto/room.dto";
import { RoomTypeHotelApiResponse } from "@/types/dto/room-types.dto";

export default function RoomForm() {
  const authInfo = useSelector((state: RootState) => state.auth.authInfo);

  const { data: roomTypeApiResponse } = useSWR<RoomTypeHotelApiResponse>(
    authInfo
      ? `${process.env.NEXT_PUBLIC_APP_URL}/api/roomTypes/hotel/${
          authInfo!.hotelId
        }`
      : null,
    axiosFetcher
  );

  let roomTypeData = null;
  if (roomTypeApiResponse && roomTypeApiResponse.success)
    roomTypeData = roomTypeApiResponse.data;

  async function handleSubmit(body: RoomDtoCreate) {
    await roomsServices.CreateOne(body);
    mutate(`/api/rooms/hotel/${authInfo!.hotelId}`);
  }

  return (
    <CardDefault>
      <div className={styles.room_form_container}>
        <div className={styles.room_form_heading}>Phòng đặt</div>
        <Form<{
          add_room_name: string;
          add_room_description: string;
          add_room_type_id: string;
        }>
          labelAlign="left"
          className={styles.add_room_form_layout}
          labelCol={{ span: 6 }}
          onFinish={(values) =>
            handleSubmit({
              name: values.add_room_name,
              description: values.add_room_description,
              room_type_id: values.add_room_type_id,
              hotel_id: authInfo!.hotelId as string,
            })
          }
        >
          <Form.Item
            name={"add_room_name"}
            label={<span className={styles.label_text}>Tên phòng</span>}
            required
          >
            <Input></Input>
          </Form.Item>
          <Form.Item
            name={"add_room_description"}
            label={<span className={styles.label_text}>Miêu tả</span>}
          >
            <Input></Input>
          </Form.Item>
          <Form.Item
            name={"add_room_type_id"}
            label={<span className={styles.label_text}>Loại phòng</span>}
            required
          >
            <Select>
              {roomTypeData &&
                roomTypeData.roomTypes.map((roomType) => (
                  <Select.Option value={roomType.id} key={roomType.id}>
                    {roomType.name}
                  </Select.Option>
                ))}
            </Select>
          </Form.Item>
          <Form.Item className={styles.room_form_submit_button}>
            <Button type="primary" shape="round" htmlType="submit">
              Tạo phòng
            </Button>
          </Form.Item>
        </Form>
      </div>
    </CardDefault>
  );
}
