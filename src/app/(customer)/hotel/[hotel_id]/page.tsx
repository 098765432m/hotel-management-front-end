"use client";

import CardDefault from "@/components/CardDefault";
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
import useSWR from "swr";

export default function HotelDetail({
  params,
}: {
  params: { hotel_id: string };
}) {
  const [dateRange, setDateRange] = useState<[Dayjs, Dayjs] | null>(null);

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
    <div className="border-white border-2 rounded-xl">
      <div className="flex justify-center space-x-2">
        <div className="w-[65%] space-y-4">
          {/* Card thông tin phòng*/}
          <CardDefault>
            <div className="flex space-x-4">
              <span className="flex-grow">
                {hotel.images.length > 0 ? (
                  hotel.images.map((image: UploadedHotelImage) => {
                    return (
                      <CldImage
                        key={image.public_id}
                        src={`${cloudinary_path}/${image.public_id}.${image.format}`}
                        width={400}
                        height={300}
                        alt={hotel.name}
                        priority
                      ></CldImage>
                    );
                  })
                ) : (
                  <CldImage
                    src={`${process.env.NEXT_PUBLIC_CLOUDINARY_DEFAULT_IMAGE}`}
                    width={400}
                    height={300}
                    alt={hotel.name}
                    priority
                  ></CldImage>
                )}
              </span>
              <span className="space-y-4 w-[50%]">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-2xl">{hotel.name}</span>
                  <span>
                    <Rating defaultValue={5} readOnly></Rating>
                  </span>
                </div>
                <div className="text-center px-4 py-4 bg-slate-300 rounded-xl">
                  {hotel.description != undefined ? (
                    <p>{hotel.description}</p>
                  ) : (
                    <p>
                      Trang chưa có miêu tảTrang chưa có miêu tảTrang chưa có
                      miêu tảTrang chưa có miêu tảTrang chưa có miêu tảTrang
                      chưa có miêu tảTrang chưa có miêu tảTrang chưa có miêu
                      tảTrang chưa có miêu tả
                    </p>
                  )}
                </div>
              </span>
            </div>
          </CardDefault>
          {/* Card Input thông tin khách hàng */}
          <CardDefault>
            <form onSubmit={handleSubmit}>
              <div className="space-y-5">
                <div>
                  <div className="font-bold text-xl">Thông tin khách hàng</div>
                  <div className="text-xs text-gray-500">
                    <i>
                      Tên khách hàng phải phù hợp với giấy tờ tùy thân để nhận
                      phòng.
                    </i>
                  </div>
                </div>
                <div className="w-full space-y-4">
                  <div className="flex space-x-2">
                    <span className="w-1/2 space-y-1">
                      <div>
                        <TextField
                          name="fullName"
                          placeholder="Họ và tên"
                        ></TextField>
                      </div>
                    </span>
                  </div>
                  <div className="flex space-x-2">
                    <span className="w-1/2 space-y-1">
                      <Input name="email" placeholder="Email"></Input>
                    </span>
                    <span className="w-1/2 space-y-1">
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
                  <div className="flex justify-center space-x-2">
                    <MantineButton type="submit">Đặt phòng</MantineButton>
                  </div>
                </div>
              </div>
            </form>
          </CardDefault>
          <div>
            <AvailableRooms hotel={hotel}></AvailableRooms>
          </div>
        </div>

        {/* Card giá phòng */}
        <div className="flex-grow">
          <CardDefault>
            <div className="space-y-2">
              <div className="space-y-1">
                <div className="font-bold text-xl">Giá chi tiết</div>
                <div className="grid pt-1">
                  <div className="flex justify-between">
                    <span>1 phòng x 2 đêm</span>
                    <span>200.000đ</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Thuế & phí</span>
                    <span>10.000đ</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Giảm giá</span>
                    <span>20.000đ</span>
                  </div>
                </div>
              </div>
              <hr />
              <div>
                <div className="flex justify-between">
                  <span>Thanh toán trực tiếp</span>
                  <span>6.520.000đ</span>
                </div>
              </div>
            </div>
          </CardDefault>
        </div>
      </div>
    </div>
  );
}
