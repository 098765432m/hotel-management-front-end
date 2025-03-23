"use client";

import NextLink from "@/components/custom-component/NextLink";
import styles from "@/styles/header/dashboard/DashboardHeader.module.scss";
import LogOutButton from "./LogOutButton";
import DashboardUserInfoHeader from "./DashboardUserInfoHeader";
import { useState } from "react";
import clsx from "clsx";
import { usePathname } from "next/navigation";

const dashboardNavItems = [
  { label: "Trang chủ", href: "/dashboard" },
  { label: "Lịch phòng", href: "/dashboard/booking" },
  { label: "Thanh toán", href: "/dashboard/payment" },
  { label: "Quản lý loại phòng", href: "/dashboard/roomType" },
  { label: "Quản lý phòng", href: "/dashboard/room" },
  { label: "Quản lý nhân viên", href: "/dashboard/staff" },
];

export default function DashboardHeader() {
  const pathName = usePathname();

  // const [selectedNavItem, setSelectedNavItem] = useState(pathName);

  return (
    <div className={styles.dashboard_header_container}>
      <div className={styles.header_staff_info}>
        <DashboardUserInfoHeader></DashboardUserInfoHeader>
      </div>
      <div className={styles.header_hotel_management_menu}>
        {/* <div>
          <NextLink href={"/dashboard"}>Trang chủ</NextLink>
        </div>
        <div>
          <NextLink href={"/dashboard/booking"}>Lịch phòng</NextLink>
        </div>
        <div>
          <NextLink href={"/dashboard/payment"}>Thanh toán</NextLink>
        </div>
        <div>
          <NextLink href={"/dashboard/roomType"}>Quản lý loại phòng</NextLink>
        </div>
        <div>
          <NextLink href={"/dashboard/room"}>Quản lý phòng</NextLink>
        </div>
        <div>
          <NextLink href={"/dashboard/staff"}>Quản lý nhân viên</NextLink>
        </div> */}
        {dashboardNavItems.map((navItem, index) => {
          return (
            <div
              className={clsx(
                navItem.href === pathName ? styles.selected_nav_item : null
              )}
              key={index}
            >
              <NextLink href={navItem.href}>{navItem.label}</NextLink>
            </div>
          );
        })}
        <div>
          <LogOutButton></LogOutButton>
        </div>
      </div>
    </div>
  );
}
