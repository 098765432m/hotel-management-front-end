"use client";

import Link from "next/link";
import Card from "../CardDefault";
import HeaderLoginButton from "./HeaderLoginButton";
import { useContext } from "react";
import { AuthContext } from "@/context/AuthContext";
import { roleEnum } from "@/types/enum/role.enum";

export default function Header() {
  const { auth } = useContext(AuthContext);

  let pathname = "/"; //Url for redirect home
  if (auth?.role == roleEnum.ADMIN) pathname = "/admin";
  else if (auth?.role == roleEnum.MANAGER || auth?.role == roleEnum.STAFF)
    pathname = "/dashboard";

  return (
    <Card>
      <div className="flex justify-between">
        <span className="text-2xl font-bold">
          <Link href={pathname}>Trip.com</Link>
        </span>
        <span className="flex space-x-8 items-center">
          {auth?.role == roleEnum.ADMIN ? (
            <span>
              <Link href={"/admin"}>Something</Link>
            </span>
          ) : auth?.role == roleEnum.MANAGER || auth?.role == roleEnum.STAFF ? (
            <span className="space-x-3">
              <Link href={"/dashboard/roomType"}>Loại phòng</Link>
              <Link href={"/dashboard/room"}>Phòng đặt</Link>
              <Link href={"/dashboard/staff"}>Nhân viên</Link>
            </span>
          ) : (
            <span>
              <Link href={"/contact"}>Liên hệ</Link>
            </span>
          )}
          <span>
            <HeaderLoginButton></HeaderLoginButton>
          </span>
        </span>
      </div>
    </Card>
  );
}
