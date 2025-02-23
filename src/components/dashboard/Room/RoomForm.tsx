"use client";

import styles from "@/styles/dashboard/room/Room.module.scss";
import { RoomType } from "@/types/roomTypes.interface";

import CardDefault from "@/components/custom-component/CardDefault";
import { Button, Form, Input, Select } from "antd";
import { axiosFetcher } from "@/lib/fetcher";
import useSWR, { mutate } from "swr";
import roomsServices from "@/services/rooms.services";
import { useSelector } from "react-redux";
import { RootState } from "@/state/store";
import { RoomDtoCreate } from "@/types/dto/room.dto";

export default function RoomForm() {
  const authInfo = useSelector((state: RootState) => state.auth.authInfo);

  const { data: roomTypes } = useSWR(
    () =>
      `${process.env.NEXT_PUBLIC_APP_URL}/api/roomTypes/hotel/${
        authInfo!.hotelId
      }`,
    axiosFetcher
  );

  async function handleSubmit(body: RoomDtoCreate) {
    await roomsServices.CreateOne(body);
    mutate(`/api/rooms/hotel/${authInfo!.hotelId}`);
  }

  if (roomTypes)
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
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 18 }}
            onFinish={(values) =>
              handleSubmit({
                name: values.add_room_name,
                description: values.add_room_description,
                room_type_id: values.add_room_type_id,
                hotel_id: authInfo!.hotelId as string,
              })
            }
          >
            <Form.Item name={"add_room_name"} label="Tên phòng" required>
              <Input></Input>
            </Form.Item>
            <Form.Item name={"add_room_description"} label="Miêu tả">
              <Input></Input>
            </Form.Item>
            <Form.Item name={"add_room_type_id"} label="Loại phòng" required>
              <Select>
                {roomTypes.map((roomType: RoomType, index: number) => (
                  <Select.Option value={roomType.id} key={index}>
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
