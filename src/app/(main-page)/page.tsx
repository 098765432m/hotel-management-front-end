import styles from "@/styles/customer/main-page/MainPage.module.scss";
import HotelCard from "@/components/HotelCard";
import EmptyData from "@/components/custom-component/EmptyData";
import CardDefault from "@/components/custom-component/CardDefault";
import CustomerSearchPanel from "@/components/customer/main-page/CustomerSearchPanel";
import axios from "axios";
import { transformAddressSelectInput } from "@/utils/helpers";
import { HotelCustomerPageDto } from "@/types/dto/hotel.dto";

export default async function Home() {
  const hotelsRes = await axios
    .get<ApiResponse<any>>(
      `${process.env.NEXT_PUBLIC_BACKEND_SERVER}/api/hotels`
    )
    .catch(function (error) {
      console.log("Khong ton tai khach san nao");
    });

  const listProvinceResponse = await axios
    .get(
      `${process.env.NEXT_PUBLIC_VN_ADDRESS_URL}/provinces/?size=${process.env.NEXT_PUBLIC_VN_ADDRESS_DEFAULT_SIZE}` as string
    )
    .catch(function (error) {
      console.log("Khong lay duoc danh sach tinh");
    });

  const listProvince =
    transformAddressSelectInput(listProvinceResponse?.data) ?? undefined;
  if (hotelsRes?.data.success)
    return (
      <div className={styles.main_page_container}>
        <CustomerSearchPanel listProvince={listProvince}></CustomerSearchPanel>
        <CardDefault className={styles.hotel_list_container}>
          <div className={styles.hotel_list_heading}>
            <h2>Khách sạn nổi bật</h2>
          </div>
          <div className={styles.hotel_list}>
            {hotelsRes.data.result.length > 0 ? (
              hotelsRes.data.result.map((hotel: HotelCustomerPageDto) => (
                <HotelCard key={hotel.id} hotel={hotel}></HotelCard>
              ))
            ) : (
              <EmptyData></EmptyData>
            )}
          </div>
        </CardDefault>
      </div>
    );
}
