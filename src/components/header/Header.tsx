"use client";

import styles from "@/styles/header/Header.module.scss";
import NextLink from "../custom-component/NextLink";
import Card from "../custom-component/CardDefault";
import HeaderLoginButton from "./HeaderLoginButton";
import { roleEnum } from "@/types/enum/role.enum";
import { useSelector } from "react-redux";
import { RootState } from "@/state/store";
import MantineButton from "../custom-component/MantineButton";
import { NavLink } from "@mantine/core";

export default function Header() {
  const authInfo = useSelector((state: RootState) => state.auth.authInfo);

  let pathname = "/";
  if (authInfo?.role == roleEnum.ADMIN) pathname = "/admin";
  else if (
    authInfo?.role == roleEnum.MANAGER ||
    authInfo?.role == roleEnum.STAFF
  )
    pathname = "/dashboard";

  return (
    <Card>
      <div className={styles.navbar}>
        <span id={styles.logo}>
          <NextLink href={pathname}>Trip.com</NextLink>
        </span>
        <span id={styles.nav_link_container}>
          {authInfo?.role == roleEnum.ADMIN ? (
            <span>
              <NextLink href={"/admin"}>Something</NextLink>
            </span>
          ) : authInfo?.role == roleEnum.MANAGER ||
            authInfo?.role == roleEnum.STAFF ? (
            <>
              <NextLink href={"/dashboard/roomType"}>Loại phòng</NextLink>
              <NextLink href={"/dashboard/room"}>Phòng đặt</NextLink>
              <NextLink href={"/dashboard/staff"}>Nhân viên</NextLink>
            </>
          ) : (
            <span>
              <NextLink href={"/contact"}>Liên hệ</NextLink>
            </span>
          )}
          <HeaderLoginButton></HeaderLoginButton>
        </span>
      </div>
    </Card>
  );
}
