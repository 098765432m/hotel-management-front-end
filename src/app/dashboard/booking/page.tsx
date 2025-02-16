"use client";
import CardDefault from "@/components/custom-component/CardDefault";
import MantineDatePicker from "@/components/custom-component/date-picker/MantineDatePicker";
import { axiosCustomFetcher } from "@/lib/fetcher";
import { RootState } from "@/state/store";
import styles from "@/styles/dashboard/booking/BookingPage.module.scss";
import { DatesRangeValue, DateValue } from "@mantine/dates";
import { Button } from "antd";
import dayjs from "dayjs";
import { useState } from "react";
import { useSelector } from "react-redux";
import useSWR from "swr";
export default function BookingPage() {
  const authInfo = useSelector((state: RootState) => state.auth.authInfo);
  console.log(authInfo);

  const [filterDate, setFilterDate] = useState<DateValue | null>(null);
  console.log(filterDate);

  const { data: bookings } = useSWR(
    filterDate != null
      ? `/api/bookings/hotel/${
          authInfo!.hotelId
        }?date=${filterDate?.toISOString()}`
      : null,
    axiosCustomFetcher
  );

  console.log("bookings", bookings);

  return (
    <div className={styles.booking_page_container}>
      <CardDefault>
        <div className={styles.booking_table_container}>
          <div className={styles.booking_table_heading}>Đặt phòng</div>
          <div className="w-64">
            <MantineDatePicker
              valueFormat="DD/MM/YYYY"
              placeholder="DD/MM/YYYY"
              onChange={(value) => {
                setFilterDate(value as DateValue);
                console.log(value);
              }}
            />
            {/* <Button type="primary">Tìm kiếm</Button> */}
          </div>
          <table>
            <thead>
              <tr>
                <th>Tên khách hàng</th>
                <th>Phòng</th>
                <th>Loại phòng</th>
                <th>Ngày đặt</th>
                <th>Ngày trả</th>
                <th>Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              {bookings && bookings.length > 0 ? (
                bookings.map((booking: any) => (
                  <tr>
                    <td>
                      {booking.user_id == null
                        ? booking.full_name
                        : booking.user.full_name}
                    </td>
                    <td>{booking.room.name}</td>
                    <td>{booking.room.room_type.name}</td>
                    <td>{dayjs(booking.check_in_date).format("DD-MM-YYYY")}</td>
                    <td>
                      {dayjs(booking.check_out_date).format("DD-MM-YYYY")}
                    </td>
                    <td>{booking.status}</td>
                  </tr>
                ))
              ) : (
                <></>
              )}
            </tbody>
          </table>
        </div>
      </CardDefault>
    </div>
  );
}
