"use client";

import styles from "@/styles/customer/hotel-detail/AvailableCard.module.scss";
import CardDefault from "@/components/custom-component/CardDefault";
import CustomTable from "@/components/custom-component/CustomTable";
import { Hotel } from "@/types/hotel.interface";
import EmptyData from "@/components/custom-component/EmptyData";
import MantineButton from "@/components/custom-component/MantineButton";

interface Props {
  hotel: Hotel;
}

export default function AvailableRooms({ hotel }: Props) {
  console.log(hotel);

  return (
    <CardDefault>
      <CustomTable>
        <thead>
          <tr>
            <th>Loại phòng</th>
            <th>Số lượng khách</th>
            <th>Giá</th>
            <th>Chọn phòng</th>
            <th>Tổng</th>
          </tr>
        </thead>
        {hotel.room_types != null && hotel.room_types.length > 0 ? (
          <tbody>
            {hotel.room_types.map((roomType, index: number) => (
              <tr key={index}>
                <td>{roomType.name}</td>
                <td>2</td>
                <td>{roomType.price}d</td>
                <td>2</td>
                {index === 0 && (
                  <td rowSpan={0}>
                    <div className={styles.booking_control}>
                      40.000.000d
                      <MantineButton>Đặt ngay</MantineButton>
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        ) : (
          <tbody>
            <tr>
              <td rowSpan={3} colSpan={5}>
                <EmptyData></EmptyData>
              </td>
            </tr>
            <tr></tr>
            <tr></tr>
          </tbody>
        )}
      </CustomTable>
    </CardDefault>
  );
}
