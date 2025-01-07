import styles from "@/styles/customer/main-page/MainPage.module.scss";
import hotelsService from "@/services/hotels.service";
import HotelCard from "@/components/HotelCard";
import { Hotel } from "@/types/hotel.interface";
import EmptyData from "@/components/custom-component/EmptyData";
import CardDefault from "@/components/custom-component/CardDefault";
import CustomerSearchPanel from "@/components/customer/main-page/CustomerSearchPanel";
import axios from "axios";
import { transformAddressSelectInput } from "@/utils/helpers";
import ProvinceCard from "@/components/customer/main-page/ProvinceCard";

export default async function Home() {
  const hotels: Hotel[] = await hotelsService.getAll();
  const listProvinceResponse = await axios.get(
    `${process.env.NEXT_PUBLIC_VN_ADDRESS_URL}/provinces/?size=${process.env.NEXT_PUBLIC_VN_ADDRESS_DEFAULT_SIZE}` as string
  );

  const listProvince =
    transformAddressSelectInput(listProvinceResponse.data) ?? undefined;

  if (hotels == undefined) return <div></div>;
  return (
    <div className={styles.main_page_container}>
      <CardDefault>
        <div>
          <CustomerSearchPanel
            listProvince={listProvince}
          ></CustomerSearchPanel>
        </div>
      </CardDefault>
      <div className="flex flex-wrap gap-4">
        {hotels.length > 0 ? (
          hotels.map((hotel: Hotel, index: number) => (
            <HotelCard key={index} hotel={hotel}></HotelCard>
          ))
        ) : (
          <div>
            <EmptyData></EmptyData>
          </div>
        )}
      </div>

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
