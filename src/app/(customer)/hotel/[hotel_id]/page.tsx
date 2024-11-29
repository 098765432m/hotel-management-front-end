"use client";

import styles from "@/styles/customer/hotel-detail/HotelDetail.module.scss";
import CardDefault from "@/components/custom-component/CardDefault";
import MantineButton from "@/components/custom-component/MantineButton";
import AvailableRooms from "@/components/customer/hotel-page/AvailableRooms";
import { axiosCustomFetcher } from "@/lib/fetcher";
import bookingsService from "@/services/bookings.service";
import { UploadedHotelImage } from "@/types/dto/image.dto";
import { rangeISOToRangeDayJS } from "@/utils/dayjs";
import { Button } from "@mantine/core";
import { Input, Rating, TextField } from "@mui/material";
import { DatePicker } from "antd";
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
import { Carousel } from "@mantine/carousel";
import NextImage from "@/components/custom-component/NextImage";
import { useToggle } from "@mantine/hooks";

export default function HotelDetail({
  params,
}: {
  params: { hotel_id: string };
}) {
  const [dateRange, setDateRange] = useState<[Dayjs, Dayjs] | null>(null);
  // const [isFavorite, setIsFavorite] = useState<boolean>(false);
  const [isFavorite, toggleFavorite] = useToggle<boolean>([false, true]);
  const cloudinary_path =
    process.env.NEXT_PUBLIC_CLOUDINARY_URL +
    "/" +
    process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME +
    "/image/upload/v1";

  const {
    data: hotel,
    isLoading: isHotelLoading,
    error: isHotelError,
  } = useSWR(`/api/hotels/${params.hotel_id}`, axiosCustomFetcher);

  //OnDateRangePicker
  const onDateRangePickerChange = (
    dates: any,
    dateStrings: [string, string]
  ) => {
    setDateRange(dates);
    console.log(dates);
    console.log(dateStrings);
  };

  //HandleSubmit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget as HTMLFormElement);

    formData.append("hotelId", params.hotel_id);

    if (dateRange != null) {
      // const formattedDateRange = `${dateRange[0].toISOString()} - ${dateRange[1].toISOString()}`;
      formData.append("checkInDate", dateRange[0].toISOString());
      formData.append("checkOutDate", dateRange[1].toISOString());
    } else {
      formData.append("dateBookingRange", "");
    }

    await bookingsService.CreateOne(formData);
  };

  //If hotel unedfine return null
  if (hotel == undefined) return <div></div>;
  return (
    <div className={styles.hotel}>
      {/* Card thông tin phòng*/}
      <div>
        <CardDefault>
          <div className={styles.hotel_detail}>
            <span className={styles.hotel_detail_images_container}>
              {hotel.images.length > 0 ? (
                <Carousel withIndicators height={"100%"}>
                  {hotel.images.map((image: UploadedHotelImage) => {
                    return (
                      <Carousel.Slide key={image.public_id}>
                        <div
                          style={{
                            aspectRatio: "3/2",
                            overflow: "hidden",
                          }}
                        >
                          <NextImage
                            key={image.public_id}
                            src={`${cloudinary_path}/${image.public_id}.${image.format}`}
                            width={400}
                            height={300}
                            alt={hotel.name}
                            priority
                            style={{
                              objectFit: "cover",
                              width: "100%",
                              height: "100%",
                            }}
                          ></NextImage>
                        </div>
                      </Carousel.Slide>
                    );
                  })}
                </Carousel>
              ) : (
                <>
                  <NextImage
                    src={`${process.env.NEXT_PUBLIC_CLOUDINARY_DEFAULT_IMAGE}`}
                    width={400}
                    height={300}
                    alt={hotel.name}
                    priority
                  ></NextImage>
                </>
              )}
            </span>
            <span className={styles.hotel_detail_heading_container}>
              <div>
                <div className={styles.hotel_detail_heading}>
                  <span className={styles.hotel_name}>{hotel.name}</span>
                  <span className={styles.button_control}>
                    <span className={styles.hotel_heading_rating_container}>
                      <span className={styles.rating_number}>4.6</span>
                      <span className={styles.rating_icon_container}>
                        <Rating defaultValue={5} readOnly></Rating>
                      </span>
                    </span>
                    <span className={styles.favorite_button_container}>
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
                    </span>
                  </span>
                </div>
                <div className={styles.hotel_detail_heading_description}>
                  {hotel.description != undefined ? (
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
                <MantineButton>Đặt ngay</MantineButton>
              </div>
            </span>
          </div>
        </CardDefault>
      </div>
      {/* Card Input thông tin khách hàng */}
      <div>
        {/* <CardDefault>
          <form onSubmit={handleSubmit}>
            <div className="">
              <div>
                <div className="">Thông tin khách hàng</div>
                <div className="">
                  <i>
                    Tên khách hàng phải phù hợp với giấy tờ tùy thân để nhận
                    phòng.
                  </i>
                </div>
              </div>
              <div className="">
                <div className="">
                  <span className="">
                    <div>
                      <TextField
                        name="fullName"
                        placeholder="Họ và tên"
                      ></TextField>
                    </div>
                  </span>
                </div>
                <div className="">
                  <span className="">
                    <Input name="email" placeholder="Email"></Input>
                  </span>
                  <span className="">
                    <Input
                      name="phoneNumber"
                      placeholder="Số điện thoại"
                    ></Input>
                  </span>
                </div>
                <div>
                  <DatePicker.RangePicker
                    value={dateRange}
                    onChange={onDateRangePickerChange}
                  ></DatePicker.RangePicker>
                </div>
                <div className="">
                  <MantineButton type="submit">Đặt phòng</MantineButton>
                </div>
              </div>
            </div>
          </form>
        </CardDefault> */}
      </div>
      <div>
        <AvailableRooms hotel={hotel}></AvailableRooms>
      </div>
    </div>
  );
}
