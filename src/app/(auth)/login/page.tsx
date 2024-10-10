"use client";

import authService from "@/services/auth.service";
import { Button, TextField } from "@mui/material";
import { useRouter } from "next/navigation";
import { useContext, useRef } from "react";
import Link from "next/link";
import React from "react";
import { AuthContext } from "@/context/AuthContext";
import { UserCookieResponse } from "@/types/dto/user.dto";
import { roleEnum } from "@/types/enum/role.enum";

export default function LoginPage() {
  const { setIsLogin, setAuth } = useContext(AuthContext);
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

    const user: UserCookieResponse | null = await authService.login(formData); //Get user info

    if (user != null) {
      setAuth(user);
      setIsLogin(true);

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
