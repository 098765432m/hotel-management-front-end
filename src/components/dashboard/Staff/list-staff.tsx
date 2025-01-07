"use client";

import CardDefault from "@/components/custom-component/CardDefault";
// import { AuthContext } from "@/context/AuthContext";
import { axiosCustomFetcher } from "@/lib/fetcher";
import { RootState } from "@/state/store";
import { StaffOfHotelDto } from "@/types/dto/user.dto";

import { useSelector } from "react-redux";
import useSWR from "swr";

interface Props {
  hotelId: string;
}

export default function ListStaff() {
  const authStore = useSelector((state: RootState) => state.auth);

  const {
    data: staffs,
    isLoading: isStaffsLoading,
    error: isStaffsError,
  } = useSWR(
    `/api/users/hotel/${authStore.authInfo?.hotelId}`,
    axiosCustomFetcher
  );
  console.log(staffs);

  if (isStaffsLoading) return <>Loading...</>;
  else
    return (
      <CardDefault>
        {staffs &&
          staffs.map((staff: StaffOfHotelDto, index: number) => {
            return (
              <div className="flex justify-around" key={index}>
                <span>Tên tài khoản{staff.username}</span>{" "}
                <span>Họ tên: {staff.fullName}</span>
                <span>Số điện thoại: {staff.phoneNumber}</span>
                <span>Địa chỉ Email: {staff.email}</span>
              </div>
            );
          })}
      </CardDefault>
    );
}
