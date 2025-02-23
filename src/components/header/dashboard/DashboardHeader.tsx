import NextLink from "@/components/custom-component/NextLink";
import styles from "@/styles/header/dashboard/DashboardHeader.module.scss";
import LogOutButton from "./LogOutButton";
import DashboardUserInfoHeader from "./DashboardUserInfoHeader";

export default async function DashboardHeader() {
  return (
    <div className={styles.dashboard_header_container}>
      <div className={styles.header_user_avatar_container}>
        <DashboardUserInfoHeader></DashboardUserInfoHeader>
      </div>
      <div className={styles.header_hotel_management_menu}>
        <div>
          <div>
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
          </div>
        </div>
        <div>
          <NextLink href={"/"}>Số liệu thống kê</NextLink>
          <LogOutButton></LogOutButton>
        </div>
      </div>
    </div>
  );
}
