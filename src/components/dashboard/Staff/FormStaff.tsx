"use client";

import styles from "@/styles/dashboard/staff/StaffPage.module.scss";
import { createDashboardUser } from "@/lib/action/user.action";
import CardDefault from "@/components/custom-component/CardDefault";
// import { AuthContext } from "@/context/AuthContext";
import usersService from "@/services/users.service";
import { RootState } from "@/state/store";
import { roleEnum } from "@/types/enum/role.enum";
import { Role } from "@prisma/client";
import { Button, Form, FormProps, Input, Radio } from "antd";
import { useSelector } from "react-redux";
import { mutate } from "swr";

type FieldType = {
  username_add: string;
  fullName_add: string;
  email_add: string;
  phoneNumber_add: string;
  role_add: Role;
};

export default function FormStaff() {
  const authStore = useSelector((state: RootState) => state.auth);

  const onFinish: FormProps<FieldType>["onFinish"] = async (value) => {
    await usersService.CreateOne({
      username: value.username_add,
      full_name: value.fullName_add,
      email: value.email_add,
      phone_number: value.phoneNumber_add,
      role: value.role_add,
      hotel_id: authStore.authInfo?.hotelId as string,
    });

    mutate(`/api/users/hotel/${authStore.authInfo?.hotelId}`);
  };

  return (
    <CardDefault className={styles.staff_form_container}>
      <div className={styles.staff_form_heading}>Thêm tài khoản</div>
      <Form
        // action={createDashboardUser}
        onFinish={onFinish}
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 18 }}
        labelAlign="left"
        className={styles.add_staff_form}
      >
        <Form.Item
          name={"username_add"}
          label="Tên tài khoản"
          rules={[{ required: true }]}
        >
          <Input></Input>
        </Form.Item>
        <Form.Item
          name={"fullName_add"}
          label="Họ và tên"
          rules={[{ required: true }]}
        >
          <Input></Input>
        </Form.Item>
        <Form.Item
          name={"email_add"}
          label="Địa chỉ email"
          rules={[{ required: true }]}
        >
          <Input></Input>
        </Form.Item>
        <Form.Item
          name={"phoneNumber_add"}
          label="Số điện thoại"
          rules={[{ required: true }]}
        >
          <Input></Input>
        </Form.Item>
        <Form.Item
          name={"role_add"}
          label="Vai trò"
          initialValue={roleEnum.STAFF}
          rules={[{ required: true }]}
        >
          <Radio.Group
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
        <Form.Item className={styles.staff_form_submit_button}>
          <Button type="primary" shape="round" htmlType="submit">
            Tạo tài khoản
          </Button>
        </Form.Item>
      </Form>
    </CardDefault>
  );
}
