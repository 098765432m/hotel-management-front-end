import CardDefault from "@/components/custom-component/CardDefault";
import styles from "@/styles/dashboard/booking/BookingPage.module.scss";
export default function BookingPage() {
  return (
    <div className={styles.booking_page_container}>
      <CardDefault>
        <div className={styles.booking_table_container}>
          <div className={styles.booking_table_heading}>Đặt phòng</div>
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
              <tr>
                <td>lê kim xuân</td>
                <td>101</td>
                <td>Phòng đôi</td>
                <td>18-4-2025</td>
                <td>20-4-2025</td>
                <td>Chưa nhận</td>
              </tr>
            </tbody>
          </table>
        </div>
      </CardDefault>
    </div>
  );
}
