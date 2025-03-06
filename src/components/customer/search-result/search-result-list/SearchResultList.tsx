"use client";

import styles from "@/styles/customer/search-result/SearchResultPage.module.scss";
import CardDefault from "@/components/custom-component/CardDefault";
import HotelResultCard from "@/components/customer/search-result/search-result-list/HotelResultCard";
import { HotelResultCardDto } from "@/types/dto/hotel.dto";
import EmptyData from "@/components/custom-component/EmptyData";
import { DatesRangeValue } from "@mantine/dates";

interface Props {
  isSearching: boolean;
  filterDateRange: DatesRangeValue | [null, null];
  resultHotel: HotelResultCardDto[];
}

export default function SearchResultList(props: Props) {
  return (
    <div className={styles.search_result_bottom}>
      <div className={styles.result_container_layout}>
        <div className={styles.layout_control}></div>
        <CardDefault>
          <div className={styles.result_container}>
            {!props.isSearching && props.resultHotel.length > 0 ? (
              props.resultHotel.map((hotel, index) => {
                return (
                  <HotelResultCard
                    filterDateRange={props.filterDateRange}
                    hotel={hotel}
                    key={index}
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
