"use client";

import styles from "@/styles/dashboard/staff/StaffPage.module.scss";
import { createDashboardUser } from "@/action/user.action";
import CardDefault from "@/components/custom-component/CardDefault";
// import { AuthContext } from "@/context/AuthContext";
import usersService from "@/services/users.service";
import { RootState } from "@/state/store";
import { roleEnum } from "@/types/enum/role.enum";
import { Role } from "@prisma/client";
import { Button, Form, FormProps, Input, Radio } from "antd";
import { useSelector } from "react-redux";

type FieldType = {
  username: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  role: Role;
};

export default function FormStaff() {
  const authStore = useSelector((state: RootState) => state.auth);

  const onFinish: FormProps<FieldType>["onFinish"] = (value) => {
    usersService.CreateOne({
      ...value,
      hotel_id: authStore.authInfo?.hotelId as string,
    });
  };

  return (
    <CardDefault>
      <div className={styles.staff_form_container}>
        <div className={styles.staff_form_heading}>Thêm tài khoản</div>
        <Form
          action={createDashboardUser}
          onFinish={onFinish}
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 18 }}
          labelAlign="left"
        >
          <Form.Item
            name={"username"}
            label="Tên tài khoản"
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
            label="Số điện thoại"
            rules={[{ required: true }]}
          >
            <Input></Input>
          </Form.Item>
          <Form.Item
            wrapperCol={{ offset: 3 }}
            name={"role"}
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
      </div>
    </CardDefault>
  );
}
