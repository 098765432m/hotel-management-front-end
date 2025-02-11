"use client";

import styles from "@/styles/dashboard/main-page/MainPage.module.scss";
import HotelForm from "@/components/dashboard/main-page/HotelForm";
import UploadedImage from "@/components/dashboard/main-page/UploadedImage";
import hotelsService from "@/services/hotels.service";
import { cookies } from "next/headers";
import { decrypt, SessionPayload } from "@/lib/session";
import CardDefault from "@/components/custom-component/CardDefault";
import { addressToString } from "@/utils/helpers";
import { Hotel } from "@/types/hotel.interface";
import { UserCookieResponse } from "@/types/dto/user.dto";
import { useSelector } from "react-redux";
import { RootState } from "@/state/store";
import useSWR from "swr";
import { axiosCustomFetcher } from "@/lib/fetcher";
import { Skeleton } from "antd";

export default function DashBoardPage() {
  // const cookieStore = cookies();

  // const authCookie = await decrypt(cookieStore.get("login")?.value as string); // Decrypt JWT
  // console.log(authCookie);

  // const authInfo: UserCookieResponse = authCookie as SessionPayload; // Convert JWT payload to auth type

  // const hotel: Hotel = await hotelsService.getOne(authInfo?.hotelId as string);

  const auInfo = useSelector((state: RootState) => state.auth.authInfo);

  const {
    data: hotel,
    isLoading: isHotelLoading,
    error: isHotelError,
  } = useSWR(`/api/hotels/${auInfo?.hotelId as string}`, axiosCustomFetcher);

  if (hotel)
    return (
      <div className={styles.dashboard_container}>
        <CardDefault>
          <div className={styles.hotel_brief_container}>
            <div className={styles.hotel_brief_heading}>
              <span className={styles.hotel_brief_hotel_name}>
                {hotel.name}
              </span>
              <HotelForm></HotelForm> {/* Chỉ hiển thị với MANAGER */}
            </div>
            <div className={styles.hotel_brief}>
              <div>{hotel.description}</div>
              <div>
                <span className={styles.label_text}>Địa chỉ:</span>{" "}
                {addressToString(hotel.address)}
              </div>
              <div>
                {" "}
                <span className={styles.label_text}>Số loại phòng: </span>
                {hotel.room_types?.length ?? 0}
              </div>
              <div>
                {" "}
                <span className={styles.label_text}>Số phòng: </span>
                {hotel.rooms?.length ?? 0}
              </div>
              <div>
                {" "}
                <span className={styles.label_text}>Tài khoản quản lý: </span>
                {hotel.staffs.length ?? 0}
              </div>
            </div>
          </div>
        </CardDefault>
        <UploadedImage></UploadedImage>
      </div>
    );
}
