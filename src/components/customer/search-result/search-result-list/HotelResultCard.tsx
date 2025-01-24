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

interface Props {
  hotelId: string;
  hotelName: string;
  description: string;
  price: number[];
  address: AddressType;
  rating: number;
  images: UploadedImageDto[];
}

export default function HotelResultCard({
  hotelId,
  hotelName,
  description,
  price,
  address,
  rating,
  images,
}: Props) {
  const [isFavorite, toggleFavorite] = useToggle<boolean>([false, true]);

  return (
    <CardDefault>
      <div className={styles.result_card}>
        <div className={styles.result_image_layout}>
          <div className={styles.result_card_image_container}>
            <NextImage
              src={
                images
                  ? `${process.env.NEXT_PUBLIC_CLOUDINARY_PATHNAME}/${images[0].public_id}.${images[0].format}`
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
              <NextLink href={"/"}>{hotelName}</NextLink>
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
          <div className={styles.content}>{description ? description : ""}</div>
          <MantineButton>Đặt ngay</MantineButton>
        </div>
      </div>
    </CardDefault>
  );
}
