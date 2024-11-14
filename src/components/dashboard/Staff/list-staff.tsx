"use client";

import CardDefault from "@/components/CardDefault";
import { AuthContext } from "@/context/AuthContext";
import { axiosCustomFetcher } from "@/lib/fetcher";
import { StaffOfHotelDto } from "@/types/dto/user.dto";
import { useContext } from "react";
import useSWR from "swr";

interface Props {
  hotelId: string;
}

export default function ListStaff() {
  const { auth } = useContext(AuthContext);
  console.log(auth);

  const {
    data: staffs,
    isLoading: isStaffsLoading,
    error: isStaffsError,
  } = useSWR(`/api/users/hotel/${auth?.hotelId}`, axiosCustomFetcher);
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
