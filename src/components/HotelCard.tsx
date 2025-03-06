"use client";

import styles from "@/styles/customer/hotel-card/HotelCard.module.scss";
import { FaMapLocationDot as MapLocation } from "react-icons/fa6";
import { Hotel } from "@/types/hotel.interface";
import { addressToString } from "@/utils/helpers";
import CardDefault from "./custom-component/CardDefault";
import NextLink from "./custom-component/NextLink";
import MantineButton from "./custom-component/MantineButton";
import NextImage from "./custom-component/NextImage";

interface Props {
  hotel: Hotel;
}

export default function HotelCard({ hotel }: Props) {
  const cloudinary_path =
    process.env.NEXT_PUBLIC_CLOUDINARY_URL +
    "/" +
    process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME +
    "/image/upload/v1";

  return (
    <CardDefault>
      <div className={styles.hotel_card}>
        <div className={styles.card_image_container}>
          {hotel.images.length > 0 ? (
            <NextImage
              priority
              src={`${cloudinary_path}/${hotel.images[0].public_id}.${hotel.images[0].format}`}
              fill
              sizes="50vw"
              alt={hotel.name}
            ></NextImage>
          ) : (
            <NextImage
              priority
              src={`${process.env.NEXT_PUBLIC_CLOUDINARY_DEFAULT_IMAGE}`}
              fill
              sizes="50vw"
              alt={hotel.name}
            ></NextImage>
          )}
        </div>
        <div className={styles.info}>
          <div className={styles.card_info_heading}>
            <div className={styles.card_info_hotel_name}>{hotel.name}</div>
            <div
              className={styles.card_info_address}
            >{`${hotel.address.district.name}, ${hotel.address.province.name}`}</div>
          </div>
          <div className={styles.card_info_main}></div>
          <div className={styles.navigation_button}>
            <NextLink href={`/hotel/${hotel.id}`}>
              <MantineButton>Xem chi tiết</MantineButton>
            </NextLink>
          </div>
        </div>
      </div>
    </CardDefault>
  );
}
