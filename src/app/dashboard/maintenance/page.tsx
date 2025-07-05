"use client";

import styles from "@/styles/dashboard/maintenance/MaintenancePage.module.scss";
import MantineDatePicker from "@/components/custom-component/date-picker/MantineDatePicker";
import MantineButton from "@/components/custom-component/MantineButton";
import NextLink from "@/components/custom-component/NextLink";
import { axiosCustomFetcher } from "@/lib/swr";
import { RootState } from "@/state/store";
import { useSelector } from "react-redux";
import useSWR from "swr";

export default function MaintenancePage() {
  const hotelId = useSelector(
    (state: RootState) => state.auth.authInfo?.hotelId
  );
  const { data: hotelMaintenances } = useSWR(
    () => `/api/hotels/${hotelId}/maintenance`,
    axiosCustomFetcher
  );
  return (
    <div>
      <title>Trang bao tri</title>
      <div>
        <div>
          <div>Bao tri khach san</div>
          <div className={styles.add_hotel_maintenace_form}>
            <MantineDatePicker
              type="range"
              className={styles.date_picker}
            ></MantineDatePicker>
            <MantineButton color="green">Yes</MantineButton>
          </div>
          <div>
            <table>
              <thead>
                <tr>
                  <th>STT</th>
                  <th>Ngay bat dau</th>
                  <th>Ngay ket thuc</th>
                  <th>Trang thai</th>
                  <th>Thao tac</th>
                </tr>
              </thead>
              <tbody>
                <tr key={1}>
                  <td>1</td>
                  <td>10-05-20</td>
                  <td>12-05-20</td>
                  <td>Done</td>
                  <td>
                    <MantineButton color="red">Xoa</MantineButton>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <NextLink href={"/dashboard/maintenance/create-room-maintenance"}>
            <MantineButton>Chinh sua</MantineButton>
          </NextLink>
        </div>
        <div>
          <div>Bao tri phong</div>
          <div>control button</div>
          <div>display table</div>
        </div>
      </div>
    </div>
  );
}
