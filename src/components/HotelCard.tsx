"use client";

import styles from "@/styles/customer/main-page/hotel-card/HotelCard.module.scss";
import { Hotel } from "@/types/hotel.interface";
import CardDefault from "./custom-component/CardDefault";
import NextLink from "./custom-component/NextLink";
import MantineButton from "./custom-component/MantineButton";
import NextImage from "./custom-component/NextImage";
import { NumberToMoneyFormat } from "@/utils/helpers";
import { Rating } from "@mantine/core";
import { HotelCustomerPageDto } from "@/types/dto/hotel.dto";
import { roundToNearestHalf } from "@/utils/math";

interface Props {
  hotel: HotelCustomerPageDto;
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
              sizes="40vw"
              alt={hotel.name}
            ></NextImage>
          ) : (
            <NextImage
              priority
              src={`${process.env.NEXT_PUBLIC_CLOUDINARY_DEFAULT_IMAGE}`}
              fill
              sizes="40vw"
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
          <div className={styles.card_info_main}>
            {hotel.ratings && hotel.ratings.length > 0 && (
              <div className={styles.card_rating_container}>
                <Rating
                  fractions={2}
                  readOnly
                  defaultValue={roundToNearestHalf(hotel.average_rating)}
                ></Rating>
                <span>
                  <span className={styles.card_rating_number}>
                    {hotel.average_rating}/5
                  </span>{" "}
                  ({hotel.ratings.length})
                </span>
              </div>
            )}
            {hotel.room_types && hotel.room_types.length > 0 && (
              <div className={styles.card_price_container}>
                {hotel.room_types &&
                  hotel.room_types.length > 0 &&
                  `Chỉ từ: ${NumberToMoneyFormat(hotel.room_types[0].price)}`}
                đ
              </div>
            )}
          </div>
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
