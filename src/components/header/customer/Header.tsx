"use client";

import styles from "@/styles/header/Header.module.scss";
import NextLink from "../../custom-component/NextLink";
import { roleEnum } from "@/types/enum/role.enum";
import { useSelector } from "react-redux";
import { RootState } from "@/state/store";
import ProfileDropDownMenu from "./ProfileDropDownMenu";
import { playfairDisplay } from "@/lib/font/playfair-display";

const data = [
  {
    label: "098765432m",
    value: "asd",
    children: [
      {
        value: "profile",
        label: "Trang cá nhân",
      },
      {
        value: "logout",
        label: "Đăng xuất",
      },
    ],
  },
];

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
    <div className={styles.navbar}>
      <span id={styles.logo} className={playfairDisplay.className}>
        <NextLink href={pathname}>Trip.com</NextLink>
      </span>
      <span id={styles.nav_link_container}>
        {authInfo?.role == roleEnum.ADMIN ? (
          <span className={styles.nav_item}>
            <NextLink href={"/admin"}>Something</NextLink>
          </span>
        ) : (
          <span className={styles.nav_item}>
            <NextLink href={"/contact"}>Liên hệ</NextLink>
          </span>
        )}
        {/* <HeaderLoginButton></HeaderLoginButton> */}
        <ProfileDropDownMenu></ProfileDropDownMenu>
      </span>
    </div>
  );
}
