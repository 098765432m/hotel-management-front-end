"use client";

import styles from "@/styles/customer/hotel-detail/HotelDetail.module.scss";
import CardDefault from "@/components/custom-component/CardDefault";
import MantineButton from "@/components/custom-component/MantineButton";
import AvailableRooms from "@/components/customer/hotel-page/AvailableRooms";
import { useScrollIntoView } from "@mantine/hooks";
import { axiosCustomFetcher } from "@/lib/swr";
import bookingsService from "@/services/bookings.service";
import { UploadedHotelImage } from "@/types/dto/image.dto";
import { rangeISOToRangeDayJS } from "@/utils/dayjs";
import { Rating } from "@mantine/core";
import { Carousel as MantineCarousel } from "@mantine/carousel";

import { Dayjs } from "dayjs";
import { CldImage } from "next-cloudinary";
import { useEffect, useState } from "react";
import { AiOutlineDownCircle } from "react-icons/ai";
import { AiOutlineRightCircle } from "react-icons/ai";
import {
  RiHeart3Line as FavoriteOutline,
  RiHeart3Fill as FavoriteFill,
} from "react-icons/ri";

import useSWR from "swr";
import NextImage from "@/components/custom-component/NextImage";
import { useToggle } from "@mantine/hooks";
import CommentSection from "@/components/customer/hotel-page/comment/CommentSection";
import { roundToNearestHalf } from "@/utils/math";
import { Hotel } from "@/types/hotel.interface";
const contentStyle: React.CSSProperties = {
  height: "160px",
  color: "#fff",
  lineHeight: "160px",
  textAlign: "center",
  background: "#364d79",
};
export default function HotelDetail({
  params,
}: {
  params: { hotel_id: string };
}) {
  const [isFavorite, toggleFavorite] = useToggle<boolean>([false, true]);
  const { scrollIntoView, targetRef } = useScrollIntoView<HTMLDivElement>(); // Hook scroll to target
  const cloudinary_path =
    process.env.NEXT_PUBLIC_CLOUDINARY_URL +
    "/" +
    process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME +
    "/image/upload/v1";

  const { data: hotelRes } = useSWR<ApiResponse<Hotel>>(
    () =>
      `${process.env.NEXT_PUBLIC_BACKEND_SERVER}/api/hotels/${params.hotel_id}`,
    axiosCustomFetcher
  );

  const hotel = hotelRes?.result;

  if (hotel)
    return (
      <div className={styles.hotel}>
        {/* Card thông tin phòng*/}
        <div>
          <CardDefault>
            <div className={styles.hotel_detail}>
              <span className={styles.hotel_detail_images_container}>
                {hotel.images && hotel.images.length > 0 ? (
                  hotel && (
                    <NextImage
                      src={`${cloudinary_path}/${hotel.images[0].public_id}.${hotel.images[0].format}`}
                      fill
                      sizes="30vw"
                      alt={hotel.name}
                      priority
                      className={styles.carousel_image_container}
                    ></NextImage>
                  )
                ) : (
                  <NextImage
                    src={`${process.env.NEXT_PUBLIC_CLOUDINARY_DEFAULT_IMAGE}`}
                    fill
                    sizes="30vw"
                    alt={hotel?.name}
                    priority
                  ></NextImage>
                )}
              </span>
              <span className={styles.hotel_detail_heading_container}>
                <div>
                  <div className={styles.hotel_detail_heading}>
                    <span className={styles.hotel_name}>{hotel?.name}</span>
                    <span className={styles.button_control}>
                      {hotel && (
                        <span className={styles.hotel_heading_rating_container}>
                          <span className={styles.rating_number}>
                            {hotel.average_rating}
                          </span>
                          <span className={styles.rating_icon_container}>
                            <Rating
                              fractions={2}
                              defaultValue={roundToNearestHalf(
                                hotel.average_rating
                              )}
                              size="lg"
                              readOnly
                            ></Rating>
                          </span>
                        </span>
                      )}
                      {/* <span className={styles.favorite_button_container}>
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
                    </span> */}
                    </span>
                  </div>
                  <div className={styles.hotel_detail_heading_description}>
                    {hotel && hotel.description != undefined ? (
                      <p>{hotel.description}</p>
                    ) : (
                      // prettier-ignore
                      <p>
                    Bạn có thể đủ điều kiện hưởng giảm giá Genius tại Peaceful Hill Homestay. Để biết giảm giá Genius có áp dụng cho ngày bạn đã chọn hay không, hãy đăng nhập.<br></br>
                    Giảm giá Genius tại chỗ nghỉ này tùy thuộc vào ngày đặt phòng, ngày lưu trú và các ưu đãi có sẵn khác. <br></br>
                    Cách Bãi biển Kê Gà 3 phút đi bộ, Peaceful Hill Homestay có khu vườn, sân hiên, điều hòa, sân trong và Wi-Fi miễn phí. <br></br>
                    Nơi đây còn có phòng tắm chung với vòi xịt/chậu rửa vệ sinh ở tất cả các căn, cùng đồ vệ sinh cá nhân miễn phí, máy sấy tóc và dép đi trong phòng.
                    Lodge có phục vụ bữa sáng kiểu Á mỗi sáng.
                    Peaceful Hill Homestay cách Hải đăng Mũi Kê Gà 1.7 km và Núi Tà Cú 25 km.
                  </p>
                    )}
                  </div>
                </div>
                <div className={styles.heading_button}>
                  <MantineButton onClick={() => scrollIntoView()}>
                    Đặt ngay
                  </MantineButton>
                </div>
              </span>
            </div>
          </CardDefault>
        </div>
        <div>
          {hotel && (
            <AvailableRooms ref={targetRef} hotel={hotel}></AvailableRooms>
          )}
        </div>
        <CommentSection hotelId={params.hotel_id}></CommentSection>
      </div>
    );
}
