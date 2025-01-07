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
    <div className={styles.result_card}>
      <div className={styles.left_part}>
        <div>
          <NextImage
            src={
              images
                ? `${process.env.NEXT_PUBLIC_CLOUDINARY_PATHNAME}/${images[0].public_id}.${images[0].format}`
                : (process.env.NEXT_PUBLIC_CLOUDINARY_DEFAULT_IMAGE as string)
            }
            alt="pic"
            width={200}
            height={100}
          ></NextImage>
        </div>
      </div>
      <div className={styles.right_part}>
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
        <div className={styles.content}>
          {description ? description : "Content here"}
        </div>
      </div>
    </div>
  );
}
