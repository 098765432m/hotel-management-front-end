"use client";

import authService from "@/services/auth.service";
import { Button, TextField } from "@mui/material";
import { useRouter } from "next/navigation";
import { useRef } from "react";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();

  // Giá trị của form input
  const usernameRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const fullNameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);

  // Xử lý submit của form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Chuyển set dữ liệu form data để gửi tới service
    const formData = new FormData();
    if (
      usernameRef.current &&
      passwordRef.current &&
      fullNameRef.current &&
      emailRef.current
    ) {
      formData.append("username", usernameRef.current.value);
      formData.append("password", passwordRef.current.value);
      formData.append("fullName", fullNameRef.current.value);
      formData.append("email", emailRef.current.value);
    } else {
      throw new Error("Lỗi input");
    }

    // Đăng ký tài khoản GUEST mới và chuyển trang
    try {
      await authService.register(formData);
    } catch (error) {
      throw new Error("Tài khoản đã tồn tại");
    }
    // if (isSuccess) router.push("/");
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="flex justify-center  my-24">
        <div className="space-y-4">
          <div className="flex justify-center">
            <div className="text-2xl font-bold">Đăng ký</div>
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
          <div>
            <TextField
              label="Họ và tên"
              variant="outlined"
              inputRef={fullNameRef}
            ></TextField>
          </div>
          <div>
            <TextField
              label="Địa chỉ email"
              variant="outlined"
              inputRef={emailRef}
            ></TextField>
          </div>
          <div className="flex justify-end">
            <span className="text-xs">
              <Link href={"/login"}>
                <i>Đã có tài khoản ?</i>
              </Link>
            </span>
          </div>
          <div className="flex justify-center">
            <Button variant="contained" type="submit" onClick={handleSubmit}>
              Đăng ký
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
}
