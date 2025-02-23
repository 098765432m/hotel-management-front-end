"use client";

import styles from "@/styles/header/ProfileDropDownMenu.module.scss";
import NextImage from "@/components/custom-component/NextImage";
import NextLink from "@/components/custom-component/NextLink";
import React, { useEffect, useRef, useState } from "react";
import useSWR from "swr";
import { axiosCustomFetcher } from "@/lib/fetcher";
import { logOut as logOutFromLib } from "@/lib/auth";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/state/store";
import { logOut as logOutFromStore } from "@/state/user/authSlice";
import { useRouter } from "next/navigation";

export default function ProfileDropDownMenu() {
  const router = useRouter();
  const [isDropDownMenuOpen, setIsDropDownMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const userInfo = useSelector((state: RootState) => state.auth.authInfo);
  const dispatch = useDispatch<AppDispatch>();

  const { data: user } = useSWR(
    () => `/api/users/${userInfo?.id}`,
    axiosCustomFetcher
  );

  useEffect(() => {
    const clickHandler = (e: MouseEvent) => {
      if (!menuRef.current?.contains(e.target as Node))
        setIsDropDownMenuOpen(false);
    };

    document.addEventListener("mousedown", clickHandler);

    return () => {
      document.removeEventListener("mousedown", clickHandler);
    };
  }, []);
  if (userInfo?.id)
    return (
      <div className={styles.menu_container} ref={menuRef}>
        <div
          className={styles.menu_trigger}
          onClick={() => setIsDropDownMenuOpen((prev) => !prev)}
        >
          <NextImage
            src={`${
              user && user.public_id
                ? `${process.env.NEXT_PUBLIC_CLOUDINARY_PATHNAME}/${user.public_id}.${user.format}`
                : process.env.NEXT_PUBLIC_CLOUDINARY_DEFAULT_IMAGE
            }`}
            width={50}
            height={50}
            alt="Avatar"
            priority
          ></NextImage>
        </div>
        {isDropDownMenuOpen && (
          <div className={styles.dropdown_menu}>
            <div className={styles.dropdown_menu_heading}>
              <h3>Username</h3>
              <span>username@as.com</span>
            </div>
            <ul>
              <DropDownItem>
                <NextLink href={`/profile`}>Trang cá nhân</NextLink>
              </DropDownItem>
              <DropDownItem>
                <span
                  onClick={async () => {
                    await logOutFromLib();
                    dispatch(logOutFromStore());
                    router.push("/login");
                  }}
                >
                  Đăng xuất
                </span>
              </DropDownItem>
            </ul>
          </div>
        )}
      </div>
    );
  else return <NextLink href={"/login"}>Đăng nhập</NextLink>;
}

interface DropDownItemProps {
  children: React.ReactNode;
}

function DropDownItem({ children }: DropDownItemProps) {
  return <li>{children}</li>;
}
