"use client";

import styles from "@/styles/dashboard/staff/StaffPage.module.scss";
import CardDefault from "@/components/custom-component/CardDefault";
import MantineButton from "@/components/custom-component/MantineButton";
import { RootState } from "@/state/store";
import { StaffHotelApiResponse, StaffOfHotelDto } from "@/types/dto/user.dto";
import { FaMagnifyingGlass } from "react-icons/fa6";
import { useSelector } from "react-redux";
import StaffCard from "./StaffCard";
import AntdPagination from "@/components/custom-component/pagination/AntdPagination";
import useCustomSWRInfinite from "@/hooks/use-swr-infinite";
import EmptyData from "@/components/custom-component/EmptyData";
import MantineLoading from "@/components/custom-component/loading/MantineLoading";
import { Input } from "antd";

export default function ListStaff() {
  const authInfo = useSelector((state: RootState) => state.auth.authInfo);

  const {
    data: staffApiResponse,
    size: staffSize,
    setSize: setStaffSize,
    mutate: staffMutate,
  } = useCustomSWRInfinite<StaffHotelApiResponse>(
    authInfo ? `/api/users/hotel/${authInfo!.hotelId}` : null
  );

  let staffData = null;
  if (
    staffApiResponse &&
    staffApiResponse.length > 0 &&
    staffApiResponse[staffSize - 1].success
  ) {
    staffData = staffApiResponse[staffSize - 1].data;
  }

  return (
    <CardDefault className={styles.staff_list_container}>
      <div className={styles.staff_list_heading}>Danh sách tài khoản</div>
      <div className={styles.staff_list_search_bar}>
        <Input
          color="amber"
          className={styles.staff_list_search_bar_input}
          placeholder="Tìm kiếm tên tài khoản, họ tên, số điện thoại, địa chỉ email"
        ></Input>
        <MantineButton>
          <FaMagnifyingGlass></FaMagnifyingGlass>
        </MantineButton>
      </div>
      {!staffData ? (
        <MantineLoading></MantineLoading>
      ) : (
        <>
          <div className={styles.staff_list}>
            {staffData && staffData.staffs.length > 0 ? (
              staffData.staffs.map((staff) => {
                return (
                  <StaffCard
                    staffMutate={staffMutate}
                    userId={staff.id}
                    key={staff.id}
                  ></StaffCard>
                );
              })
            ) : (
              <EmptyData></EmptyData>
            )}
          </div>
          <AntdPagination
            current={staffSize}
            onChange={(value: number) => setStaffSize(value)}
            total={staffData?.total ?? 0}
          ></AntdPagination>
        </>
      )}
    </CardDefault>
  );
}
