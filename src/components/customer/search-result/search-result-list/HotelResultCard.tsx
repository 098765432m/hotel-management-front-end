"use client";

import styles from "@/styles/customer/search-result/HotelResultCard.module.scss";
import NextImage from "@/components/custom-component/NextImage";
import NextLink from "@/components/custom-component/NextLink";
import { UploadedImageDto } from "@/types/dto/image.dto";
import { AddressType } from "@/types/vietnamese-location-api/address";
import { useToggle } from "@mantine/hooks";
import {
  RiHeart3Line as FavoriteOutline,
  RiHeart3Fill as FavoriteFill,
} from "react-icons/ri";
import CardDefault from "@/components/custom-component/CardDefault";
import MantineButton from "@/components/custom-component/MantineButton";
import { useRouter } from "next/navigation";
import { HotelResultCardDto } from "@/types/dto/hotel.dto";
import { DatesRangeValue } from "@mantine/dates";

interface Props {
  filterDateRange: DatesRangeValue | [null, null];
  hotel: HotelResultCardDto;
}

export default function HotelResultCard(props: Props) {
  const router = useRouter();
  const [isFavorite, toggleFavorite] = useToggle<boolean>([false, true]);

  console.log("hotel-result-card -- images", props.hotel.hotelImages);

  return (
    <CardDefault>
      <div className={styles.result_card}>
        <div className={styles.result_image_layout}>
          <div className={styles.result_card_image_container}>
            <NextImage
              src={
                props.hotel.hotelImages &&
                props.hotel.hotelImages.length > 0 &&
                props.hotel.hotelImages[0].public_id
                  ? `${process.env.NEXT_PUBLIC_CLOUDINARY_PATHNAME}/${props.hotel.hotelImages[0].public_id}.${props.hotel.hotelImages[0].format}`
                  : (process.env.NEXT_PUBLIC_CLOUDINARY_DEFAULT_IMAGE as string)
              }
              alt="pic"
              fill
              sizes="50vw"
              className="object-cover"
            ></NextImage>
          </div>
        </div>
        <div className={styles.result_info_layout}>
          <div className={styles.header}>
            <div>
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
            <div>
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
            </div>
          </div>
          <div className={styles.content}>
            {props.hotel.hotelDescription ? props.hotel.hotelDescription : ""}
          </div>
          <MantineButton
            onClick={() =>
              router.push(
                `/hotel/${
                  props.hotel.hotelId
                }?filterDateRange=${encodeURIComponent(
                  JSON.stringify(props.filterDateRange)
                )}`
              )
            }
          >
            Đặt ngay
          </MantineButton>
        </div>
      </div>
    </CardDefault>
  );
}
