"use client";

import styles from "@/styles/auth/login.module.scss";
import authService from "@/services/auth.service";
import { Button, TextField } from "@mui/material";
import { useRouter } from "next/navigation";
import { useRef } from "react";
import Link from "next/link";
import React from "react";
import { UserCookieResponse } from "@/types/dto/user.dto";
import { roleEnum } from "@/types/enum/role.enum";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/state/store";
import { logIn } from "@/state/user/authSlice";
import CardDefault from "@/components/custom-component/CardDefault";
import { Form, useForm } from "@mantine/form";
import { PasswordInput, TextInput } from "@mantine/core";
import MantineButton from "@/components/custom-component/MantineButton";
import NextLink from "@/components/custom-component/NextLink";

export default function LoginPage() {
  const form = useForm({
    mode: "uncontrolled",
  });
  // Global Dispatch START

  const dispatch = useDispatch<AppDispatch>();

  // Global Dispatch END

  const router = useRouter();

  // Giá trị của form input
  const usernameRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  // Xử lý Submit của Form
  const handleSubmit = async (username: string, password: string) => {
    const user: UserCookieResponse | null = await authService.login(
      username,
      password
    ); //Get user info

    if (user != null) {
      dispatch(logIn(user));

      // Redirect User by Role
      switch (user.role) {
        case roleEnum.ADMIN:
          router.push("/admin");
          break;
        case roleEnum.MANAGER || roleEnum.STAFF:
          router.push("/dashboard");
          break;
        case roleEnum.GUEST:
          router.push("/");
          break;

        default:
          break;
      }
    }
  };

  return (
    <div className={styles.login_form_container}>
      <CardDefault>
        <div className={styles.login_form_heading}>Đăng nhập</div>
        <form
          className={styles.login_form}
          onSubmit={form.onSubmit((values) =>
            handleSubmit(values.username, values.password)
          )}
        >
          <TextInput
            withAsterisk
            label="Tên đăng nhập"
            placeholder="Tên đăng nhập"
            key={form.key("username")}
            {...form.getInputProps("username")}
          ></TextInput>
          <div>
            <PasswordInput
              withAsterisk
              label="Mật khẩu"
              placeholder="Mật khẩu"
              key={form.key("password")}
              {...form.getInputProps("password")}
            ></PasswordInput>
            <div className={styles.register_link}>
              <NextLink href={`/register`}>Chưa có tài khoản</NextLink>
            </div>
          </div>
          <div className={styles.login_form_control}>
            <MantineButton type="submit">Đăng nhập</MantineButton>
          </div>
        </form>
      </CardDefault>
    </div>
  );
}
