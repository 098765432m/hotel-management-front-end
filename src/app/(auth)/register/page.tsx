"use client";

import styles from "@/styles/auth/register.module.scss";
import authService from "@/services/auth.service";
import {
  Button,
  TextField,
  Snackbar,
  Alert,
  SnackbarCloseReason,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import Link from "next/link";
import CardDefault from "@/components/custom-component/CardDefault";
import { PasswordInput, TextInput } from "@mantine/core";
import NextLink from "@/components/custom-component/NextLink";
import MantineButton from "@/components/custom-component/MantineButton";
import { useForm } from "@mantine/form";

interface RegisterForm {
  username: string;
  password: string;
  checkedPassword: string;
  fullName: string;
  email: string;
  phoneNumber: string;
}

export default function RegisterPage() {
  const form = useForm<RegisterForm>({
    mode: "uncontrolled",
  });
  const router = useRouter();

  // Xử lý submit của form
  const handleSubmit = async (body: RegisterForm) => {
    // Đăng ký tài khoản GUEST mới và chuyển trang

    if (body.password === body.checkedPassword) {
      await authService.register(
        body.username,
        body.password,
        body.fullName,
        body.email,
        body.phoneNumber
      );
      router.push("/login");
    } else {
      alert("Mật khẩu không đúng");
    }
  };

  return (
    <>
      <div className={styles.register_form_container}>
        <CardDefault>
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
            </div>
            <div className={styles.register_form_control}>
              <MantineButton type="submit">Đăng ký</MantineButton>
            </div>
          </form>
        </CardDefault>
      </div>
    </>
  );
}
