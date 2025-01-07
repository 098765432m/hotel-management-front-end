"use client";

import CardDefault from "@/components/custom-component/CardDefault";
import MantineButton from "@/components/custom-component/MantineButton";
import NextImage from "@/components/custom-component/NextImage";
import styles from "@/styles/dashboard/staff/StaffPage.module.scss";
import { Modal } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { Button, Form, Input } from "antd";
import { FaEdit } from "react-icons/fa";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";

interface Props {
  id: string;
  username: string;
  fullName: string;
  phoneNumber: string;
  email: string;
}

export default function StaffCard({
  id,
  username,
  fullName,
  phoneNumber,
  email,
}: Props) {
  const [isEditFormOpened, { open: openEditForm, close: closeEditForm }] =
    useDisclosure(false);
  return (
    <CardDefault>
      <div className={styles.staff_card_container}>
        <div className={styles.staff_avatar_container}>
          <div className={styles.round_border}>
            <NextImage
              src={process.env.NEXT_PUBLIC_CLOUDINARY_DEFAULT_IMAGE as string}
              height={80}
              width={80}
              alt="Default"
            ></NextImage>
          </div>
          <div className={styles.staff_edit_button}>
            <MantineButton
              color="yellow"
              size="compact-sm"
              onClick={openEditForm}
            >
              <FaEdit></FaEdit>
            </MantineButton>
          </div>
        </div>
        <div>
          <span className={styles.label_text}>Tên tài khoản:</span> {username}
        </div>
        <div>
          <span className={styles.label_text}>Họ tên: </span>
          {fullName}
        </div>
        <div>
          <span className={styles.label_text}>Số điện thoại: </span>
          {phoneNumber}
        </div>
        <div>
          <span className={styles.label_text}>Email: </span>
          {email}
        </div>
      </div>
      <Modal
        title="Chỉnh sửa"
        opened={isEditFormOpened}
        onClose={closeEditForm}
      >
        <Form
          labelAlign="left"
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 18 }}
        >
          <Form.Item name={"username"} label="Tên tài khoản">
            <Input></Input>
          </Form.Item>
          <Form.Item name={"fullName"} label="Họ tên">
            <Input></Input>
          </Form.Item>
          <Form.Item name={"phoneNumber"} label="Số điện thoại">
            <Input></Input>
          </Form.Item>
          <Form.Item name={"email"} label="Email">
            <Input></Input>
          </Form.Item>

          <Form.Item className="flex justify-center">
            <Button type="primary" htmlType="submit">
              <IoMdCheckmarkCircleOutline
                size={20}
              ></IoMdCheckmarkCircleOutline>{" "}
              Lưu
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </CardDefault>
  );
}
