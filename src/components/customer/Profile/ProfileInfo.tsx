"use client";

import styles from "@/styles/customer/profile/ProfilePage.module.scss";
import { updateAccount } from "@/lib/action/user.action";
import CardDefault from "@/components/custom-component/CardDefault";
import CustomTable from "@/components/custom-component/CustomTable";
import EmptyData from "@/components/custom-component/EmptyData";
import MantineButton from "@/components/custom-component/MantineButton";
import NextImage from "@/components/custom-component/NextImage";
import { axiosCustomFetcher } from "@/lib/swr";
import bookingsService from "@/services/bookings.service";
import { RootState } from "@/state/store";
import { GetBookingsByUserDtoResponse } from "@/types/dto/booking.dto";
import { Modal, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { Button, TextField } from "@mui/material";
import axios from "axios";
import dayjs from "dayjs";
import { CldImage, CldUploadWidget } from "next-cloudinary";
import { useEffect, useRef, useState } from "react";
import { FaEdit } from "react-icons/fa";
import { FaTrashCan } from "react-icons/fa6";
import { useSelector } from "react-redux";
import useSWR, { mutate } from "swr";
import usersService from "@/services/users.service";
import { UserGetResponseDto } from "@/types/dto/user.dto";
import { useRouter } from "next/navigation";

interface Props {
  user_init: UserGetResponseDto;
}

export default function ProfileInfo({ user_init }: Props) {
  const router = useRouter();
  const [openedEditForm, { open: openEditForm, close: closeEditForm }] =
    useDisclosure(false);

  // Get User Data
  const { data: user, mutate: userMutate } = useSWR(
    () => `${process.env.NEXT_PUBLIC_APP_URL}/api/users/${user_init.id}`,
    axiosCustomFetcher
  );

  const form = useForm({
    mode: "uncontrolled",
    initialValues: {
      username: user_init.username,
      fullName: user_init.fullName,
      email: user_init.email,
      phoneNumber: user_init.phoneNumber,
    },
  });

  async function handleSubmit() {
    const data = form.getValues();
    await usersService.UpdateOne(user_init.id, {
      username: data.username,
      fullName: data.fullName,
      email: data.email,
      phoneNumber: data.phoneNumber,
    });
    userMutate();
    router.refresh();
    closeEditForm();
  }

  const userRef = useRef(user);

  useEffect(() => {
    userRef.current = user;
  }, [user]);

  if (user)
    return (
      <>
        <CardDefault>
          <div className={styles.profile_info_container}>
            <div className={styles.profile_image_container}>
              <div className={styles.profile_image}>
                <NextImage
                  src={`${process.env.NEXT_PUBLIC_CLOUDINARY_URL}/${
                    process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
                  }/image/upload/v1/${
                    user!.image
                      ? `${user.image.public_id}.${user.image.format}`
                      : "wbhblyipju67ukdval6m.png"
                  }`}
                  width={200}
                  height={200}
                  alt="Avatar"
                  priority
                ></NextImage>
              </div>
              <div className={styles.edit_image_button}>
                <CldUploadWidget
                  signatureEndpoint={`/api/sign-cloudinary-params`}
                  onSuccess={(result) => {
                    if (
                      result.info != null &&
                      typeof result.info === "object"
                    ) {
                      axios
                        .post(
                          `${process.env.NEXT_PUBLIC_APP_URL}/api/updateAvatar`,
                          {
                            user_id: userRef.current?.id,
                            old_img_public_id:
                              userRef.current?.image?.public_id ?? null,
                            img_public_id: result.info.public_id,
                            img_format: result.info.format,
                          },
                          {
                            headers: {
                              "Content-Type": "application/json",
                            },
                          }
                        )
                        .then((res) => {
                          userMutate();
                        })
                        .catch((err) => {
                          console.error("Error saving Image: ", err);
                        });
                    }
                  }}
                >
                  {({ open }) => {
                    return (
                      <MantineButton onClick={() => open()}>
                        Upload
                      </MantineButton>
                    );
                  }}
                </CldUploadWidget>
              </div>
            </div>
            <div className={styles.username_container}>
              <span className={styles.username_text}>{user.username}</span>
              <span
                onClick={openEditForm}
                className={styles.edit_button_container}
              >
                <FaEdit size={14}></FaEdit>
              </span>
            </div>
            <div>{user.email}</div>
          </div>
        </CardDefault>
        <Modal
          opened={openedEditForm}
          onClose={closeEditForm}
          title="Chỉnh sửa"
        >
          <form
            onSubmit={form.onSubmit((values) => handleSubmit())}
            className={styles.edit_form_container}
          >
            <TextInput
              label="Tên tài khoản"
              placeholder="Tên tài khoản"
              key={form.key("username")}
              {...form.getInputProps("username")}
            ></TextInput>
            <TextInput
              label="Họ và tên"
              placeholder="Họ và tên"
              key={form.key("fullName")}
              {...form.getInputProps("fullName")}
            ></TextInput>
            <TextInput
              label="Email"
              placeholder="Email"
              key={form.key("email")}
              {...form.getInputProps("email")}
            ></TextInput>
            <TextInput
              label="Số điện thoại"
              placeholder="Số điện thoại"
              key={form.key("phoneNumber")}
              {...form.getInputProps("phoneNumber")}
            ></TextInput>
            <MantineButton type="submit">Lưu</MantineButton>
          </form>
        </Modal>
      </>
    );
}
