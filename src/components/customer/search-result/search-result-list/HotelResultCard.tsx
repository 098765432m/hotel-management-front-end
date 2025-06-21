"use client";

import styles from "@/styles/customer/search-result/HotelResultCard.module.scss";
import NextImage from "@/components/custom-component/NextImage";
import NextLink from "@/components/custom-component/NextLink";
import {
  RiHeart3Line as FavoriteOutline,
  RiHeart3Fill as FavoriteFill,
} from "react-icons/ri";
import CardDefault from "@/components/custom-component/CardDefault";
import MantineButton from "@/components/custom-component/MantineButton";
import { useRouter } from "next/navigation";
import { HotelResultCardDto } from "@/types/dto/hotel.dto";
import { DatesRangeValue } from "@mantine/dates";
import { Rating } from "@mantine/core";
import { roundToNearestHalf } from "@/utils/math";
import { FaLocationDot } from "react-icons/fa6";
import { NumberToMoneyFormat } from "@/utils/helpers";

interface Props {
  filterDateRange: DatesRangeValue | [null, null];
  hotel: HotelResultCardDto;
}

export default function HotelResultCard(props: Props) {
  const router = useRouter();
  // const [isFavorite, toggleFavorite] = useToggle<boolean>([false, true]);

  return (
    <CardDefault>
      <div
        className={styles.result_card}
        onClick={() =>
          router.push(
            `/hotel/${props.hotel.hotelId}?filterDateRange=${encodeURIComponent(
              JSON.stringify(props.filterDateRange)
            )}`
          )
        }
      >
        <div className={styles.result_image_layout}>
          <div className={styles.result_card_image_container}>
            <NextImage
              src={
                props.hotel.imagePublicId && props.hotel.imageFormat
                  ? `${process.env.NEXT_PUBLIC_CLOUDINARY_PATHNAME}/${props.hotel.imagePublicId}.${props.hotel.imageFormat}`
                  : (process.env.NEXT_PUBLIC_CLOUDINARY_DEFAULT_IMAGE as string)
              }
              alt="pic"
              fill
              sizes="10vw"
              className="object-cover"
            ></NextImage>
          </div>
        </div>
        <div className={styles.hotel_info_layout}>
          <div className={styles.hotel_upper_container}>
            <div className={styles.hotel_name}>
              <NextLink
                href={`/hotel/${
                  props.hotel.hotelId
                }?filterDateRange=${encodeURIComponent(
                  JSON.stringify(props.filterDateRange)
                )}`}
              >
                {props.hotel.hotelName}
              </NextLink>
            </div>

            <div className={styles.hotel_rating_container}>
              <Rating
                size={"lg"}
                fractions={2}
                readOnly
                defaultValue={roundToNearestHalf(props.hotel.hotelRating)}
              ></Rating>
              <span>
                <span className={styles.rating_number}>
                  {props.hotel.hotelRating}
                </span>
                /5
              </span>
            </div>
          </div>
          <div className={styles.hotel_address}>
            <span className={styles.icon_location}>
              <FaLocationDot size={12}></FaLocationDot>
            </span>
            {`${props.hotel.hotelAddress.district.name}, ${props.hotel.hotelAddress.province.name}`}
          </div>
          <div className={styles.hotel_price_container}>
            <span className={styles.label_text}>Chỉ từ:</span>{" "}
            <span className={styles.price_number}>
              {NumberToMoneyFormat(props.hotel.hotalMinPrice)}đ
            </span>
          </div>
        </div>
        {/* <div>
              {isFavorite ? (
                <FavoriteFill
                  onClick={() => toggleFavorite()}
                  size={28}
                  color="#f28482"
                ></FavoriteFill>
              ) : (
                <FavoriteOutline
                  size={28}
                  color="f28482"
                  onClick={() => toggleFavorite()}
                ></FavoriteOutline>
              )}
            </div> */}
      </div>
    </CardDefault>
  );
}
