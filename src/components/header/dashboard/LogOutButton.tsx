"use client";

import styles from "@/styles/header/dashboard/DashboardHeader.module.scss";
import { useRouter } from "next/navigation";
import { logOut as logOutFromLib } from "@/lib/auth";
import { AppDispatch } from "@/state/store";
import { useDispatch } from "react-redux";

import { logOut as logOutFromStore } from "@/state/user/authSlice";

export default function LogOutButton() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  return (
    <div
      className={styles.log_out_button}
      onClick={async () => {
        await logOutFromLib();
        dispatch(logOutFromStore());
        router.push("/login");
      }}
    >
      Đăng xuất
    </div>
  );
}
