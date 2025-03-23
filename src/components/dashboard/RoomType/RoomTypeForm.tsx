"use client";

import styles from "@/styles/dashboard/room-type/RoomType.module.scss";
import roomTypesServices from "@/services/roomTypes.services";
import { RootState } from "@/state/store";
import { Input, InputNumber, Button, Form, Skeleton, message } from "antd";
import { useSelector } from "react-redux";

interface RoomTypeFormValues {
  name: string;
  price: number;
}

interface Props {
  roomTypeMutate: () => void;
}

export default function RoomTypeForm(props: Props) {
  const authStore = useSelector((state: RootState) => state.auth);

  //Hiển thị Message
  const [messageApi, contextHolder] = message.useMessage();

  const handleFinish = async (values: RoomTypeFormValues) => {
    try {
      const body = {
        name: values.name,
        price: values.price,
        hotel_id: authStore.authInfo?.hotelId!,
      };

      await roomTypesServices.CreateOne(body);

      props.roomTypeMutate();
      messageApi.success("Tạo loại phòng thành công");
    } catch (error) {
      console.error(error);

      messageApi.error("Có lỗi xảy ra khi tạo phòng, vui lòng thử lại sau");
    }
  };

  return (
    <>
      {contextHolder}
      <Form
        onFinish={handleFinish}
        className={styles.room_type_add_form}
        labelCol={{ span: 10 }}
        labelAlign="left"
      >
        <div className={styles.room_type_add_form_heading}>Loại phòng</div>

        <div className={styles.room_type_add_form_input}>
          <Form.Item
            name="name"
            label={<span className={styles.label_text}>Tên loại phòng</span>}
            required
          >
            <Input></Input>
          </Form.Item>
          <Form.Item
            name="price"
            label={<span className={styles.label_text}>Giá (đ/đêm)</span>}
            initialValue={0}
            required
          >
            <InputNumber step={1000}></InputNumber>
          </Form.Item>
        </div>
        <Form.Item className={styles.room_type_add_form_submit_button}>
          <Button type="primary" htmlType="submit">
            Tạo loại phòng
          </Button>
        </Form.Item>
      </Form>
    </>
  );
}
