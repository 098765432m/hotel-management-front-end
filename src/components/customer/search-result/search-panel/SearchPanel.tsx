"use client";

import styles from "@/styles/customer/search-result/SearchResultPage.module.scss";
import CardDefault from "@/components/custom-component/CardDefault";
import MantineButton from "@/components/custom-component/MantineButton";
import { RangeSlider, Select, TextInput } from "@mantine/core";
import { FaMagnifyingGlass } from "react-icons/fa6";
import { useCallback, useEffect, useState } from "react";
import { HotelResultCardDto } from "@/types/dto/hotel.dto";
import hotelsService from "@/services/hotels.service";
import { useSearchParams } from "next/navigation";

interface Province {
  label: string;
  value: string;
}

interface Props {
  hotelName: string;
  setHotelName: (value: string) => void;
  priceRange: [number, number] | null;
  setPriceRange: (value: [number, number] | null) => void;
  ratingRange: [number, number] | null;
  setRatingRange: (value: [number, number]) => void;
  setProvinceId: (value: string) => void;
  listProvince: Province[] | undefined;
  performSearch: () => void;
}

export default function SearchPanel({
  hotelName,
  setHotelName,
  priceRange,
  setPriceRange,
  ratingRange,
  setRatingRange,
  setProvinceId,
  listProvince,
  performSearch,
}: Props) {
  return (
    <CardDefault>
      <div className={styles.search_panel_container}>
        <div className={styles.search_result_heading}>Tìm kiếm</div>
        <div className={styles.search_text_container}>
          <TextInput
            value={hotelName}
            onChange={(event) => setHotelName(event.currentTarget.value)}
            placeholder="Tên khách sạn"
            className={styles.search_input}
          ></TextInput>
          <MantineButton onClick={() => performSearch()}>
            <FaMagnifyingGlass></FaMagnifyingGlass>
          </MantineButton>
        </div>
        <div className={styles.filter_panel_container}>
          <div className={styles.filter_slider_flex_container}>
            <div className={styles.filter_slider_container}>
              <div>
                <span className="">Giá/đêm</span>
              </div>
              <RangeSlider
                defaultValue={[0, 8000000]}
                min={0}
                max={8000000}
                step={500000}
                minRange={500000}
                value={priceRange ?? undefined}
                onChange={(value: [number, number]) => {
                  setPriceRange(value);
                }}
                marks={[
                  { value: 0, label: "0" },
                  { value: 2000000, label: "2 tr" },
                  { value: 4000000, label: "4 tr" },
                  { value: 6000000, label: "6 tr" },
                  { value: 8000000, label: "8 tr" },
                ]}
              ></RangeSlider>
            </div>
            <div className={styles.filter_slider_container}>
              <div>
                <span>Đánh giá</span>
              </div>
              <RangeSlider
                value={ratingRange ?? undefined}
                onChange={(value: [number, number]) => {
                  setRatingRange(value);
                }}
                min={0}
                max={5}
                minRange={0.5}
                step={0.5}
                marks={[
                  { value: 0, label: "0" },
                  { value: 1, label: "1" },
                  { value: 2, label: "2" },
                  { value: 3, label: "3" },
                  { value: 4, label: "4" },
                  { value: 5, label: "5" },
                ]}
              ></RangeSlider>
            </div>
          </div>
          <div>
            <div>Tỉnh/Thành phố</div>
            <Select
              data={[{ label: "Tất cả", value: "" }, ...(listProvince ?? [])]}
              onChange={(value: string | null) => {
                setProvinceId(value as string);
              }}
              placeholder="Chọn tỉnh thành"
            ></Select>
          </div>
        </div>
      </div>
    </CardDefault>
  );
}
