"use client";

import styles from "@/styles/customer/search-result/SearchResultPage.module.scss";
import CardDefault from "@/components/custom-component/CardDefault";
import { RangeSlider, Select, Slider, TextInput } from "@mantine/core";
import MantineButton from "@/components/custom-component/MantineButton";
import { FaMagnifyingGlass } from "react-icons/fa6";
import HotelResultCard from "@/components/customer/search-result/search-result-list/HotelResultCard";
import { useCallback, useEffect, useMemo, useState } from "react";
import hotelsService from "@/services/hotels.service";
import { HotelResultCardDto } from "@/types/dto/hotel.dto";
import { useSearchParams } from "next/navigation";
import EmptyData from "@/components/custom-component/EmptyData";

interface Province {
  label: string;
  value: string;
}

interface Props {
  isSearching: boolean;
  resultHotel: HotelResultCardDto[];
}

export default function SearchResultList({ isSearching, resultHotel }: Props) {
  return (
    <div className={styles.search_result_bottom}>
      <div className={styles.result_container_layout}>
        <div className={styles.layout_control}></div>
        <CardDefault>
          <div className={styles.result_container}>
            {!isSearching && resultHotel.length > 0 ? (
              resultHotel.map((hotel, index) => {
                return (
                  <HotelResultCard
                    hotelId={hotel.hotelId}
                    hotelName={hotel.hotelName}
                    description={hotel.hotelDescription}
                    price={hotel.hotelPrice}
                    rating={hotel.hotelRating}
                    images={hotel.hotelImages}
                    address={hotel.hotelAddress}
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
