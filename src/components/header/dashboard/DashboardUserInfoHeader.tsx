"use client";

import styles from "@/styles/header/dashboard/DashboardHeader.module.scss";
import NextImage from "@/components/custom-component/NextImage";
import { axiosCustomFetcher } from "@/lib/swr";
import useSWR from "swr";
import { useSelector } from "react-redux";
import { RootState } from "@/state/store";
export default function DashboardUserInfoHeader() {
  const authInfo = useSelector((state: RootState) => state.auth.authInfo);
  const { data: user } = useSWR(
    () => `/api/users/${authInfo?.id as string}`,
    axiosCustomFetcher
  );

  if (user)
    return (
      <div className={styles.header_staff_info}>
        <NextImage
          width={50}
          height={50}
          alt="User Avatar"
          src={
            user && user.image
              ? `${process.env.NEXT_PUBLIC_CLOUDINARY_PATHNAME}/${user.image.public_id}.${user.image.format}`
              : (process.env.NEXT_PUBLIC_CLOUDINARY_DEFAULT_IMAGE as string)
          }
        ></NextImage>
        <div>{user.username}</div>
      </div>
    );
}
