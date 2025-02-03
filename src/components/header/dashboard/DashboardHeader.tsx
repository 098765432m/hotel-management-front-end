import NextImage from "@/components/custom-component/NextImage";
import NextLink from "@/components/custom-component/NextLink";
import { logOut as logOutFromLib } from "@/lib/auth";
import { decrypt, SessionPayload } from "@/lib/session";
import usersService from "@/services/users.service";
import styles from "@/styles/header/dashboard/DashboardHeader.module.scss";
import { UserCookieResponse, UserGetResponseDto } from "@/types/dto/user.dto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import LogOutButton from "./LogOutButton";

export default async function DashboardHeader() {
  const cookiesStore = cookies();

  const authCookie = await decrypt(cookiesStore.get("login")?.value as string); // Decrypt JWT
  const authInfo: UserCookieResponse = (authCookie as SessionPayload) ?? null; // Convert JWT payload to auth type

  const user: UserGetResponseDto = await usersService.GetOne(authInfo.id);

  const handleLogout = async () => {
    await logOutFromLib();
    redirect("/login");
  };
  return (
    <div className={styles.dashboard_header_container}>
      <div className={styles.header_staff_info}>
        <NextImage
          width={50}
          height={50}
          alt="User Avatar"
          src={
            user.image
              ? `${process.env.NEXT_PUBLIC_CLOUDINARY_PATHNAME}/${user.image.public_id}.${user.image.format}`
              : (process.env.NEXT_PUBLIC_CLOUDINARY_DEFAULT_IMAGE as string)
          }
        ></NextImage>
        <div>{user.username}</div>
      </div>
      <div className={styles.header_hotel_management_menu}>
        <div>
          <div>
            <NextLink href={"/dashboard"}>Trang chủ</NextLink>
          </div>
          <div>
            <NextLink href={"/dashboard"}>Lịch phòng</NextLink>
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
          <div>Số liệu thống kê</div>
          <LogOutButton></LogOutButton>
        </div>
      </div>
    </div>
  );
}
