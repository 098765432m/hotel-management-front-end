"use client";
// import { AuthContext } from "@/context/AuthContext";
import roomTypesServices from "@/services/roomTypes.services";
import { RootState } from "@/state/store";
import { UserCookieResponse } from "@/types/dto/user.dto";
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
      <Form onFinish={handleFinish}>
        <div className="flex justify-center my-12">
          <div className="space-y-4">
            <div className="flex justify-center">
              <div className="text-2xl font-bold">Loại phòng</div>
            </div>
            <div>
              <Form.Item name="name" label="Ten loai">
                <Input></Input>
              </Form.Item>
            </div>
            <div>
              <Form.Item name="price" label="Gia loai" initialValue={0}>
                <InputNumber step={1000}></InputNumber>
              </Form.Item>
            </div>
            <Form.Item>
              <div className="flex justify-center">
                <Button type="primary" htmlType="submit">
                  Tạo loại phòng
                </Button>
              </div>
            </Form.Item>
          </div>
        </div>
      </Form>
    </Skeleton>
  );
}
