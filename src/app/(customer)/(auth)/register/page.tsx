"use client";

import styles from "@/styles/auth/register.module.scss";
import authService from "@/services/auth.service";
import { useRouter } from "next/navigation";
import CardDefault from "@/components/custom-component/CardDefault";
import { Box, LoadingOverlay, PasswordInput, TextInput } from "@mantine/core";
import NextLink from "@/components/custom-component/NextLink";
import MantineButton from "@/components/custom-component/MantineButton";
import { useForm } from "@mantine/form";
import { useState } from "react";
import ErrorCustomNotify from "@/components/custom-component/notification/ErrorCustomNotify";
import axios, { AxiosError } from "axios";
import { RiLoginBoxLine } from "react-icons/ri";
import { FaUserPlus } from "react-icons/fa6";

interface RegisterForm {
  username: string;
  password: string;
  address: string;
  checkedPassword: string;
  fullName: string;
  email: string;
  phoneNumber: string;
}

export default function RegisterPage() {
  const [registerStatus, setRegisterStatus] = useState<null | {
    status: "LOADING" | "ERROR" | "SUCCESS";
    message: string;
  }>(null);

  const form = useForm<RegisterForm>({
    mode: "uncontrolled",
    initialValues: {
      username: "",
      password: "",
      address: "",
      checkedPassword: "",
      fullName: "",
      email: "",
      phoneNumber: "",
    },
    validate: {
      username: (value) =>
        value.length < 6 ? "Tên đăng nhập phải có ít nhất 6 ký tự" : null,
      password: (value) =>
        value.length < 6 ? "Mật khẩu phải có ít nhất 6 ký tự" : null,
      checkedPassword: (value) =>
        value.length < 6 ? "Mật khẩu phải có ít nhất 6 ký tự" : null,
      fullName: (value) =>
        value.length < 6 ? "Họ và tên phải có ít nhất 6 ký tự" : null,
      email: (value) => {
        const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,3}$/;
        if (!emailRegex.test(value)) return "Email không hợp lệ";
      },
      phoneNumber: (value) => {
        const phoneRegex = /^[0-9]{10}$/;
        if (!phoneRegex.test(value)) {
          return "Số điện thoại không hợp lệ";
        }
      },
    },
  });
  const router = useRouter();

  // Xử lý submit của form
  const handleSubmit = async (body: RegisterForm) => {
    // Đăng ký tài khoản GUEST mới và chuyển trang
    console.log("body: ", body);

    try {
      setRegisterStatus({ status: "LOADING", message: "" });
      if (body.password === body.checkedPassword) {
        await axios.post(
          `${process.env.NEXT_PUBLIC_BACKEND_SERVER}/api/users/sign-up`,
          {
            username: body.username,
            password: body.password,
            address: body.address,
            email: body.email,
            phone_number: body.phoneNumber,
            full_name: body.fullName,
          }
        );
        // await authService.register(
        //   body.username,
        //   body.password,
        //   body.fullName,
        //   body.email,
        //   body.phoneNumber
        // );
        setRegisterStatus(null);
        router.push("/login");
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        setRegisterStatus({
          status: "ERROR",
          message: error.response?.data.message,
        });
      }
    }
  };

  return (
    <div className={styles.register_form_container}>
      <CardDefault>
        <Box pos={"relative"}>
          <LoadingOverlay
            visible={registerStatus?.status === "LOADING"}
          ></LoadingOverlay>
          <div className={styles.register_form_heading}>Đăng ký</div>
          <form
            className={styles.register_form}
            onSubmit={form.onSubmit((values: RegisterForm) =>
              handleSubmit(values)
            )}
          >
            <TextInput
              withAsterisk
              label="Tên đăng nhập"
              placeholder="Tên đăng nhập"
              key={form.key("username")}
              {...form.getInputProps("username")}
            ></TextInput>

            <PasswordInput
              withAsterisk
              label="Mật khẩu"
              placeholder="Mật khẩu"
              key={form.key("password")}
              {...form.getInputProps("password")}
            ></PasswordInput>
            <PasswordInput
              withAsterisk
              label="Xác minh mật khẩu"
              placeholder="Xác minh lại mật khẩu"
              key={form.key("checkedPassword")}
              {...form.getInputProps("checkedPassword")}
            ></PasswordInput>
            <TextInput
              withAsterisk
              label="Địa chỉ"
              placeholder="địa chỉ"
              key={form.key("address")}
              {...form.getInputProps("address")}
            ></TextInput>
            <TextInput
              withAsterisk
              label="Họ và tên"
              placeholder="Họ và tên"
              key={form.key("fullName")}
              {...form.getInputProps("fullName")}
            ></TextInput>
            <TextInput
              withAsterisk
              label="Email"
              placeholder="Địa chỉ email"
              key={form.key("email")}
              {...form.getInputProps("email")}
            ></TextInput>
            <div>
              <TextInput
                withAsterisk
                label="Số điện thoại"
                placeholder="Số điện thoại"
                key={form.key("phoneNumber")}
                {...form.getInputProps("phoneNumber")}
              ></TextInput>
              <div className={styles.login_link}>
                <NextLink href={`/login`}>Đã có tài khoản?</NextLink>
              </div>
              {registerStatus?.status === "ERROR" && (
                <ErrorCustomNotify
                  message={registerStatus.message}
                ></ErrorCustomNotify>
              )}
            </div>
            <div className={styles.register_form_control}>
              <MantineButton type="submit">
                <div className={styles.register_button_text}>
                  <span>Đăng ký</span> <FaUserPlus size={20}></FaUserPlus>
                </div>
              </MantineButton>
            </div>
          </form>
        </Box>
      </CardDefault>
    </div>
  );
}
