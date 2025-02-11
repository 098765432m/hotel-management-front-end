"use client";

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
