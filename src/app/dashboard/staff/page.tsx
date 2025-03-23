"use client";

import styles from "@/styles/dashboard/staff/StaffPage.module.scss";
import FormStaff from "@/components/dashboard/Staff/FormStaff";
import ListStaff from "@/components/dashboard/Staff/ListStaff";
import { useSelector } from "react-redux";
import { RootState } from "@/state/store";
import useCustomSWRInfinite from "@/hooks/use-swr-infinite";
import { StaffHotelApiResponse } from "@/types/dto/user.dto";

export default function StaffPage() {
  const authInfo = useSelector((state: RootState) => state.auth.authInfo);

  const { mutate: staffMutate } = useCustomSWRInfinite<StaffHotelApiResponse>(
    authInfo?.hotelId ? `/api/users/hotel/${authInfo!.hotelId}` : null
  );

  return (
    <div className={styles.staff_page_container}>
      <FormStaff staffMutate={staffMutate}></FormStaff>
      <ListStaff></ListStaff>
    </div>
  );
}
