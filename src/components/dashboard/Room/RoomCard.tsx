"use client";

import styles from "@/styles/dashboard/room/Room.module.scss";
import CardDefault from "@/components/custom-component/CardDefault";
import { Room } from "@/types/room.interface";
import { Modal, Button } from "@mantine/core";
import { FaEdit } from "react-icons/fa";
import { useDisclosure } from "@mantine/hooks";
import { Form, Input, Select, Button as AntdButton } from "antd";
import { RoomType } from "@/types/roomTypes.interface";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";
import { IoTrashBinOutline } from "react-icons/io5";
import MantineButton from "@/components/custom-component/MantineButton";
import useSWR, { mutate } from "swr";
import { axiosCustomFetcher } from "@/lib/swr";
import roomsServices from "@/services/rooms.services";
import { RoomDtoUpdateRequest } from "@/types/dto/room.dto";
import { RoomTypeHotelPayload } from "@/types/dto/room-types.dto";

interface Props {
  hotelId: string;
  roomId: string;
  roomTypes: RoomTypeHotelPayload[] | null;
}

export default function RoomCard({ hotelId, roomId, roomTypes }: Props) {
  const [opened, { open, close }] = useDisclosure(false);

  const { data: room } = useSWR(
    () => `/api/rooms/${roomId}`,
    axiosCustomFetcher
  );

  async function handleSubmit(id: string, body: RoomDtoUpdateRequest) {
    await roomsServices.UpdateOne(id, body);
    mutate(`/api/rooms/hotel/${hotelId}`);
  }

  async function handleDelete(id: string) {
    await roomsServices.DeleteOne(id);
    mutate(`/api/rooms/hotel/${hotelId}`);
  }

  if (room)
    return (
      <>
        <CardDefault>
          <div className={styles.room_card}>
            <div className={styles.room_card_header}>
              <span>
                <span className={styles.label_text}>Phòng:</span> {room.name}
              </span>
              <span>
                <MantineButton color="yellow" size="compact-sm" onClick={open}>
                  <FaEdit></FaEdit>
                </MantineButton>
              </span>
            </div>
          </div>
          <div>
            <span className={styles.label_text}>Loại phòng:</span>{" "}
            {room.room_type.name}
          </div>
        </CardDefault>
        <Modal
          title="Chỉnh sửa"
          opened={opened}
          onClose={close}
          className={styles.edit_form_container}
        >
          <Form<{
            roomName: string;
            roomDescription: string;
            roomTypeId: string;
          }>
            labelAlign="left"
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 18 }}
            className={styles.edit_form}
            initialValues={{
              roomName: room.name,
              roomDescription: room.description ?? "",
              roomTypeId: room.room_type_id,
            }}
            onFinish={(values) =>
              handleSubmit(roomId, {
                room_type_id: values.roomTypeId,
                name: values.roomName,
                description: values.roomDescription,
              })
            }
          >
            <Form.Item name={"roomName"} label="Phòng" required>
              <Input></Input>
            </Form.Item>
            <Form.Item name={"roomDescription"} label="Miêu tả">
              <Input></Input>
            </Form.Item>
            <Form.Item name={"roomTypeId"} label="Loại phòng" required>
              <Select>
                {roomTypes &&
                  roomTypes.map((roomType: RoomType, index: number) => (
                    <Select.Option value={roomType.id} key={index}>
                      {roomType.name}
                    </Select.Option>
                  ))}
              </Select>
            </Form.Item>
            <div className={styles.edit_form_control}>
              <Form.Item>
                <AntdButton type="primary" htmlType="submit">
                  <IoMdCheckmarkCircleOutline
                    size={20}
                  ></IoMdCheckmarkCircleOutline>{" "}
                  Lưu
                </AntdButton>
              </Form.Item>

              <AntdButton
                type="primary"
                danger
                onClick={() => {
                  handleDelete(roomId);
                }}
              >
                <IoTrashBinOutline size="20"></IoTrashBinOutline>Xóa
              </AntdButton>
            </div>
          </Form>
        </Modal>
      </>
    );
}
