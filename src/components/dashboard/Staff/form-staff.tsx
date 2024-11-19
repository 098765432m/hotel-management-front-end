"use client";

import { createDashboardUser } from "@/action/user.action";
// import { AuthContext } from "@/context/AuthContext";
import usersService from "@/services/users.service";
import { RootState } from "@/state/store";
import { roleEnum } from "@/types/enum/role.enum";
import { Role } from "@prisma/client";
import { Button, Form, FormProps, Input, Radio } from "antd";
import { useContext } from "react";
import { useSelector } from "react-redux";

type FieldType = {
  username: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  role: Role;
};

export default function FormStaff() {
  // const { auth } = useContext(AuthContext);
  const authStore = useSelector((state: RootState) => state.auth);

  const onFinish: FormProps<FieldType>["onFinish"] = (value) => {
    usersService.CreateOne({
      ...value,
      hotel_id: authStore.authInfo?.hotelId as string,
    });
  };

  return (
    <Form action={createDashboardUser} onFinish={onFinish}>
      <Form.Item
        name={"username"}
        label="username"
        rules={[{ required: true }]}
      >
        <Input></Input>
      </Form.Item>
      <Form.Item
        name={"fullName"}
        label="Họ và tên"
        rules={[{ required: true }]}
      >
        <Input></Input>
      </Form.Item>
      <Form.Item
        name={"email"}
        label="Địa chỉ email"
        rules={[{ required: true }]}
      >
        <Input></Input>
      </Form.Item>
      <Form.Item
        name={"phoneNumber"}
        label="Sô điện thoại"
        rules={[{ required: true }]}
      >
        <Input></Input>
      </Form.Item>
      <Form.Item name={"role"} label="Vai trò" initialValue={roleEnum.STAFF}>
        <Radio.Group
          // defaultValue={roleEnum.STAFF}
          options={[
            {
              label: "Nhân viên",
              value: roleEnum.STAFF,
            },
            {
              label: "Quản lý",
              value: roleEnum.MANAGER,
            },
          ]}
          optionType="button"
        ></Radio.Group>
      </Form.Item>
      <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
        <Button type="primary" shape="round" htmlType="submit">
          Tạo tài khoản
        </Button>
      </Form.Item>
    </Form>
  );
}
