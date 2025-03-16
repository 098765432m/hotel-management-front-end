import styles from "@/styles/customer/main-page/MainPage.module.scss";
import hotelsService from "@/services/hotels.service";
import HotelCard from "@/components/HotelCard";
import EmptyData from "@/components/custom-component/EmptyData";
import CardDefault from "@/components/custom-component/CardDefault";
import CustomerSearchPanel from "@/components/customer/main-page/CustomerSearchPanel";
import axios from "axios";
import { transformAddressSelectInput } from "@/utils/helpers";
import ProvinceCard from "@/components/customer/main-page/ProvinceCard";
import { HotelCustomerPageDto } from "@/types/dto/hotel.dto";

export default async function Home() {
  const hotels: HotelCustomerPageDto[] = await hotelsService.getAll();
  const listProvinceResponse = await axios.get(
    `${process.env.NEXT_PUBLIC_VN_ADDRESS_URL}/provinces/?size=${process.env.NEXT_PUBLIC_VN_ADDRESS_DEFAULT_SIZE}` as string
  );

  const listProvince =
    transformAddressSelectInput(listProvinceResponse.data) ?? undefined;
  if (hotels && hotels.length > 0)
    return (
      <div className={styles.main_page_container}>
        <CustomerSearchPanel listProvince={listProvince}></CustomerSearchPanel>
        <CardDefault className={styles.hotel_list_container}>
          <div className={styles.hotel_list_heading}>
            <h2>Khách sạn nổi bật</h2>
          </div>
          <div className={styles.hotel_list}>
            {hotels.length > 0 ? (
              hotels.map((hotel: HotelCustomerPageDto, index) => (
                <HotelCard key={hotel.id + index} hotel={hotel}></HotelCard>
              ))
            ) : (
              <EmptyData></EmptyData>
            )}
          </div>
        </CardDefault>

        <CardDefault>
          <div className={styles.province_card_container}>
            <div className={styles.province_card_header}>Địa điểm nổi bật</div>
            <div className={styles.province_card_body}>
              {listProvince?.map(
                (province: { label: string; value: string }, index) => {
                  return (
                    <ProvinceCard
                      name={province.label}
                      index={index}
                      key={index}
                      provinceId={province.value}
                    ></ProvinceCard>
                  );
                }
              )}
            </div>
          </div>
        </CardDefault>
      </div>
    );
}
