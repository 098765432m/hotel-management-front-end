"use client";

import styles from "@/styles/dashboard/main-page/MainPage.module.scss";
import HotelForm from "@/components/dashboard/main-page/HotelForm";
import UploadedImage from "@/components/dashboard/main-page/UploadedImage";
import hotelsService from "@/services/hotels.service";
import CardDefault from "@/components/custom-component/CardDefault";
import { addressToString } from "@/utils/helpers";
import { Hotel } from "@/types/hotel.interface";
import { useSelector } from "react-redux";
import { RootState } from "@/state/store";
import useSWR from "swr";
import { axiosCustomFetcher } from "@/lib/swr";

export default function DashBoardPage() {
  const auInfo = useSelector((state: RootState) => state.auth.authInfo);

  const { data: hotel } = useSWR(
    () => `/api/hotels/${auInfo!.hotelId}`,
    axiosCustomFetcher
  );

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
