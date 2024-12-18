"use client";

import { updateAccount } from "@/action/user.action";
import CardDefault from "@/components/custom-component/CardDefault";
import CustomTable from "@/components/custom-component/CustomTable";
import EmptyData from "@/components/custom-component/EmptyData";
import MantineButton from "@/components/custom-component/MantineButton";
// import { AuthContext } from "@/context/AuthContext";
import { axiosCustomFetcher } from "@/lib/fetcher";
import bookingsService from "@/services/bookings.service";
import { RootState } from "@/state/store";
import { GetBookingsByUserDtoResponse } from "@/types/dto/booking.dto";
import { Button, TextField } from "@mui/material";
import axios from "axios";
import dayjs from "dayjs";
import { CldImage, CldUploadWidget } from "next-cloudinary";
import { useContext, useEffect, useRef, useState } from "react";
import { FaTrashCan } from "react-icons/fa6";
import { useSelector } from "react-redux";
import useSWR, { mutate } from "swr";

export default function ProfileInfo() {
  const authStore = useSelector((state: RootState) => state.auth);

  // Get User Data
  const {
    data: user,
    isLoading: isUserLoading,
    error: isUserError,
    mutate: userMutate,
  } = useSWR(
    `${process.env.NEXT_PUBLIC_APP_URL}/api/users/${authStore.authInfo?.id}`,
    axiosCustomFetcher
  );

  // Get Booking Data Table
  const {
    data: bookings,
    isLoading: isBookingsLoading,
    error: isBookingsError,
    mutate: bookingsMutate,
  } = useSWR(
    `${process.env.NEXT_PUBLIC_APP_URL}/api/bookings/user/${authStore.authInfo?.id}`,
    axiosCustomFetcher
  );

  console.log(bookings);

  const userRef = useRef(user);

  useEffect(() => {
    userRef.current = user;
  }, [user]);

  // Handle Customer Remove Booking
  async function handleRemove(bookingId: string, roomId: string) {
    await bookingsService.unBookingOne(bookingId, roomId);
  }

  if (!isUserLoading)
    return (
      <>
        <CardDefault>
          <div className="flex gap-4">
            <>
              <div>
                <CldImage
                  src={`${process.env.NEXT_PUBLIC_CLOUDINARY_URL}/${
                    process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
                  }/image/upload/v1/${
                    user!.image
                      ? `${user.image.public_id}.${user.image.format}`
                      : "wbhblyipju67ukdval6m.png"
                  }`}
                  width={380}
                  height={600}
                  alt="Avatar"
                  priority
                ></CldImage>
              </div>
              <div>
                <CldUploadWidget
                  signatureEndpoint={`/api/sign-cloudinary-params`}
                  onSuccess={(result) => {
                    console.log("onSuccess");

                    console.log(userRef.current);

                    if (
                      result.info != null &&
                      typeof result.info === "object"
                    ) {
                      axios
                        .post(
                          `${process.env.NEXT_PUBLIC_APP_URL}/api/updateAvatar`,
                          {
                            user_id: userRef.current?.id,
                            old_img_public_id:
                              userRef.current?.image?.public_id ?? null,
                            img_public_id: result.info.public_id,
                            img_format: result.info.format,
                          },
                          {
                            headers: {
                              "Content-Type": "application/json",
                            },
                          }
                        )
                        .then((res) => {
                          console.log(res);

                          userMutate();
                        })
                        .catch((err) => {
                          console.error("Error saving Image: ", err);
                        });
                    }
                  }}
                >
                  {({ open }) => {
                    return <Button onClick={() => open()}>Upload</Button>;
                  }}
                </CldUploadWidget>
              </div>
            </>
            <form
              action={updateAccount}
              className="grid justify-items-center gap-2"
            >
              <TextField
                name="username"
                label="Tên tài khoản"
                variant="outlined"
                defaultValue={user.username}
              ></TextField>
              <TextField
                name="fullName"
                label="Họ và tên"
                variant="outlined"
                defaultValue={user.fullName}
              ></TextField>
              <TextField
                name="email"
                label="Địa chỉ email"
                variant="outlined"
                defaultValue={user.email}
              ></TextField>
              <Button variant="contained" type="submit">
                Chỉnh sửa
              </Button>
            </form>
          </div>
        </CardDefault>
        <CardDefault>
          <div>Phòng đặt trước</div>
          <div>
            <CustomTable>
              <thead>
                <tr>
                  <th>Khách sạn</th>
                  <th>Loại</th>
                  <th>Phòng số</th>
                  <th>Ngày nhận</th>
                  <th>Ngày trả</th>
                  <th>Giá</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {bookings ? (
                  bookings &&
                  bookings.map((booking: GetBookingsByUserDtoResponse) => {
                    return (
                      <tr>
                        <td>{booking.hotel_name}</td>
                        <td>{booking.room_type_name}</td>
                        <td>{booking.room_name}</td>
                        <td>
                          {dayjs(booking.check_in_date).format("DD-MM-YYYY")}
                        </td>
                        <td>
                          {dayjs(booking.check_out_date).format("DD-MM-YYYY")}
                        </td>
                        <td>{booking.price}</td>
                        <td>
                          {
                            <button
                              onClick={async () => {
                                await handleRemove(booking.id, booking.room_id);
                                bookingsMutate();
                              }}
                              disabled={booking.status != "BOOKED"}
                            >
                              <FaTrashCan color="red"></FaTrashCan>
                            </button>
                          }
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={7}>
                      <EmptyData></EmptyData>
                    </td>
                  </tr>
                )}
              </tbody>
            </CustomTable>
          </div>
        </CardDefault>
        <CardDefault>History charge</CardDefault>
      </>
    );
}
