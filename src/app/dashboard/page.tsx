import styles from "@/styles/dashboard/main-page/MainPage.module.scss";
import HotelForm from "@/components/dashboard/main-page/HotelForm";
import UploadedImage from "@/components/dashboard/main-page/UploadedImage";
import hotelsService from "@/services/hotels.service";
import { cookies } from "next/headers";
import { decrypt } from "@/lib/session";
import CardDefault from "@/components/custom-component/CardDefault";
import { addressToString } from "@/utils/helpers";
import { Hotel } from "@/types/hotel.interface";

export default async function DashBoardPage() {
  const cookieStore = await cookies();
  const decryptedData = await decrypt(
    cookieStore.get("login")?.value as string
  );
  const hotelId = decryptedData?.hotelId as string;

  if (hotelId) {
    const hotel: Hotel = await hotelsService.getOne(hotelId);

    return (
      <div className={styles.dashboard_container}>
        <CardDefault>
          <div className={styles.hotel_brief_container}>
            <div className={styles.hotel_brief_heading}>
              <span className={styles.hotel_brief_hotel_name}>
                {hotel.name}
              </span>
              <HotelForm></HotelForm> {/* Chỉ hiển thị với MANAGER */}
            </div>
            <div className={styles.hotel_brief}>
              <div>{hotel.description}</div>
              <div>
                <span className={styles.label_text}>Địa chỉ:</span>{" "}
                {addressToString(hotel.address)}
              </div>
              <div>
                {" "}
                <span className={styles.label_text}>Số loại phòng: </span>
                {hotel.room_types?.length ?? 0}
              </div>
              <div>
                {" "}
                <span className={styles.label_text}>Số phòng: </span>
                {hotel.rooms?.length ?? 0}
              </div>
              <div>
                {" "}
                <span className={styles.label_text}>Tài khoản quản lý: </span>
                {hotel.staffs.length ?? 0}
              </div>
            </div>
          </div>
        </CardDefault>
        <UploadedImage></UploadedImage>
      </div>
    );
  } else {
    return <div>Not Found Hotel</div>;
  }
}
