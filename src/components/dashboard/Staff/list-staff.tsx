"use client";

import CardDefault from "@/components/CardDefault";
// import { AuthContext } from "@/context/AuthContext";
import { axiosCustomFetcher } from "@/lib/fetcher";
import { RootState } from "@/state/store";
import { StaffOfHotelDto } from "@/types/dto/user.dto";
import { useContext } from "react";
import { useSelector } from "react-redux";
import useSWR from "swr";

interface Props {
  hotelId: string;
}

export default function ListStaff() {
  // const { auth } = useContext(AuthContext);
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
              <div className="flex justify-around">
                <span>Ten tai khoan{staff.username}</span>{" "}
                <span>Ho ten: {staff.fullName}</span>
                <span>So dien thoai: {staff.phoneNumber}</span>
                <span>email: {staff.email}</span>
              </div>
            );
          })}
      </CardDefault>
    );
}
