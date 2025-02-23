"use client";

import styles from "@/styles/dashboard/staff/StaffPage.module.scss";
import CardDefault from "@/components/custom-component/CardDefault";
import MantineButton from "@/components/custom-component/MantineButton";
import { axiosCustomFetcher } from "@/lib/fetcher";
import { RootState } from "@/state/store";
import { StaffOfHotelDto } from "@/types/dto/user.dto";
import { TextInput } from "@mantine/core";
import { FaMagnifyingGlass } from "react-icons/fa6";

import { useSelector } from "react-redux";
import useSWR from "swr";
import StaffCard from "./StaffCard";

export default function ListStaff() {
  const authInfo = useSelector((state: RootState) => state.auth.authInfo);

  const { data: staffs } = useSWR(
    () => `/api/users/hotel/${authInfo!.hotelId}`,
    axiosCustomFetcher
  );

  return (
    <CardDefault>
      <div className={styles.staff_list_container}>
        <div className={styles.staff_list_heading}>Danh sách tài khoản</div>
        <div className={styles.staff_list_search_bar}>
          <TextInput
            className={styles.staff_list_search_bar_input}
            placeholder="Tìm kiếm tên tài khoản, họ tên, số điện thoại, địa chỉ email"
          ></TextInput>
          <MantineButton>
            <FaMagnifyingGlass></FaMagnifyingGlass>
          </MantineButton>
        </div>
        <div className={styles.staff_list}>
          {staffs &&
            staffs.length > 0 &&
            staffs.map((staff: StaffOfHotelDto, index: number) => {
              return <StaffCard userId={staff.id} key={index}></StaffCard>;
            })}
        </div>
      </div>
    </CardDefault>
  );
}
