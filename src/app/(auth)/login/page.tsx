"use client";

import authService from "@/services/auth.service";
import { Button, TextField } from "@mui/material";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import Link from "next/link";
import React from "react";
import { promise1, promise2 } from "@/utils/api";

export default function LoginPage() {
  const router = useRouter();

  // Giá trị của form input
  const usernameRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  // Xử lý Submit của Form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Chuyển set dữ liệu form data để gửi tới service
    const formData = new FormData();
    if (usernameRef.current && passwordRef.current) {
      formData.append("username", usernameRef.current.value);
      formData.append("password", passwordRef.current.value);
    }
    let isSuccess;
    try {
      isSuccess = await authService.login(formData);

      // console.log("Login successful", response);
    } catch (error) {
      throw new Error("Lỗi đăng nhập");
    }
    if (isSuccess) router.push("/");
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="flex justify-center  my-24">
        <div className="space-y-4">
          <div className="flex justify-center">
            <div className="text-2xl font-bold">Đăng nhập</div>
          </div>
          <div>
            <TextField
              label="Tên đăng nhập"
              variant="outlined"
              inputRef={usernameRef}
            ></TextField>
          </div>
          <div>
            <TextField
              type="password"
              label="Mật khẩu"
              variant="outlined"
              inputRef={passwordRef}
            ></TextField>
          </div>
          <div className="flex justify-end">
            <span className="text-xs">
              <Link href={"/register"}>
                <i>Chưa có tài khoản ?</i>
              </Link>
            </span>
          </div>
          <div className="flex justify-center">
            <Button variant="contained" type="submit" onClick={handleSubmit}>
              Đăng nhập
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
}
