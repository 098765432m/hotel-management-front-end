"use client";

import styles from "@/styles/customer/search-result/SearchResultPage.module.scss";
import CardDefault from "@/components/custom-component/CardDefault";
import HotelResultCard from "@/components/customer/search-result/search-result-list/HotelResultCard";
import EmptyData from "@/components/custom-component/EmptyData";
import { DatesRangeValue } from "@mantine/dates";
import { FilterHotel } from "@/types/dto/hotel.dto";

interface Props {
  filterDateRange: DatesRangeValue | [null, null];
  filterHotels: FilterHotel[];
}

export default function SearchResultList(props: Props) {
  return (
    <div className={styles.search_result_bottom}>
      <div className={styles.result_container_layout}>
        <div className={styles.layout_control}></div>
        <CardDefault>
          <div className={styles.heading}>Kết quả</div>
          <div className={styles.result}>
            {props.filterHotels && props.filterHotels.length > 0 ? (
              props.filterHotels.map((hotel) => {
                return (
                  <HotelResultCard
                    filterDateRange={props.filterDateRange}
                    hotel={hotel}
                    key={hotel.hotel_id}
                  ></HotelResultCard>
                );
              })
            ) : (
              <div className={styles.empty_data_container}>
                <EmptyData></EmptyData>
              </div>
            )}
          </div>
        </CardDefault>
      </div>
    </div>
  );
}
