"use client";

import styles from "@/styles/dashboard/room-type/RoomType.module.scss";
import roomTypesServices from "@/services/roomTypes.services";
import { RootState } from "@/state/store";
import { Input, InputNumber, Button, Form, Skeleton } from "antd";

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

interface RoomTypeFormValues {
  name: string;
  price: number;
}

export default function RoomTypeForm() {
  const [isPageLoading, setPageLoading] = useState(true);
  const authStore = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    setPageLoading(false);
  });

  const handleFinish = async (values: RoomTypeFormValues) => {
    const body = {
      name: values.name,
      price: values.price,
      hotel_id: authStore.authInfo?.hotelId!,
    };
    console.log(body);

    await roomTypesServices.CreateOne(body);
  };

  return (
    <Skeleton loading={isPageLoading} active>
      <Form
        onFinish={handleFinish}
        className={styles.room_type_add_form}
        labelCol={{ span: 10 }}
        labelAlign="left"
      >
        <div className={styles.room_type_add_form_heading}>Loại phòng</div>

        <div className={styles.room_type_add_form_input}>
          <Form.Item name="name" label="Tên loại phòng">
            <Input></Input>
          </Form.Item>
          <Form.Item name="price" label="Giá (đ/đêm)" initialValue={0}>
            <InputNumber step={1000}></InputNumber>
          </Form.Item>
        </div>
        <Form.Item className={styles.room_type_add_form_submit_button}>
          <Button type="primary" htmlType="submit">
            Tạo loại phòng
          </Button>
        </Form.Item>
      </Form>
    </Skeleton>
  );
}
