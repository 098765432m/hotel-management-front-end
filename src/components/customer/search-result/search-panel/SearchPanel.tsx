"use client";

import styles from "@/styles/customer/search-result/SearchResultPage.module.scss";
import CardDefault from "@/components/custom-component/CardDefault";
import MantineButton from "@/components/custom-component/MantineButton";
import { RangeSlider, Select, TextInput } from "@mantine/core";
import { DatesRangeValue, DateValue } from "@mantine/dates";
import MantineDatePicker from "@/components/custom-component/date-picker/MantineDatePicker";
import { useId } from "react";

interface Province {
  label: string;
  value: string;
}

interface Props {
  hotelName: string;
  setHotelName: (value: string) => void;
  priceRange: [number, number] | [null, null];
  setPriceRange: (value: [number, number] | [null, null]) => void;
  ratingRange: [number, number] | [null, null];
  setRatingRange: (value: [number, number] | [null, null]) => void;
  filterDateRange: DatesRangeValue | [null, null];
  setFilterDateRange: (value: DatesRangeValue | [null, null]) => void;
  provinceId: string | null;
  setProvinceId: (value: string | null) => void;
  listProvince: Province[] | undefined;
  performSearch: () => void;
}

export default function SearchPanel(props: Props) {
  const searchPanelId = useId();
  return (
    <CardDefault>
      <div className={styles.search_panel_container}>
        <div className={styles.search_result_heading}>Tìm kiếm</div>
        <div className={styles.filter_input_layout}>
          <div className={styles.filter_hotel_name_container}>
            <label
              className={styles.label_text}
              htmlFor={`hotelName-${searchPanelId}`}
            >
              Tên khách sạn
            </label>
            <TextInput
              id={`hotelName-${searchPanelId}`}
              value={props.hotelName ?? ""}
              onChange={(event) =>
                props.setHotelName(event.currentTarget.value)
              }
              placeholder="Tên khách sạn"
              className={styles.search_input}
            ></TextInput>
          </div>
          <div className={styles.filter_address_container}>
            <label
              className={styles.label_text}
              htmlFor={`hotelProvince-${searchPanelId}`}
            >
              Tỉnh/Thành phố
            </label>
            <Select
              id={`hotelProvince-${searchPanelId}`}
              data={[
                { label: "Tất cả", value: "" },
                ...(props.listProvince ?? []),
              ]}
              defaultValue={props.provinceId ?? ""}
              onChange={(value: string | null) => {
                props.setProvinceId(value);
              }}
              placeholder="Chọn tỉnh thành"
            ></Select>
          </div>
          <div className={styles.filter_date_range_container}>
            <label
              className={styles.label_text}
              htmlFor={`hotelFilterDateRange-${searchPanelId}`}
            >
              Ngày tra cứu
            </label>
            <MantineDatePicker
              id={`hotelFilterDateRange-${searchPanelId}`}
              type="range"
              placeholder="Chọn ngày tra cứu"
              defaultValue={props.filterDateRange} // <-- Causing Error
              onChange={(value: DatesRangeValue | DateValue | Date[]) => {
                if (Array.isArray(value) && value.length === 2) {
                  props.setFilterDateRange(value as DatesRangeValue);
                } else {
                  props.setFilterDateRange([null, null]);
                }
              }}
            ></MantineDatePicker>
          </div>
          <div className={styles.filter_slider_container}>
            <label
              className={styles.label_text}
              htmlFor={`hotelPriceRange-${searchPanelId}`}
            >
              Giá
            </label>

            <RangeSlider
              id={`hotelPriceRange-${searchPanelId}`}
              defaultValue={[0, 500000]}
              min={0}
              max={500000}
              step={50000}
              minRange={50000}
              value={
                props.priceRange && props.priceRange[0]
                  ? props.priceRange
                  : undefined
              }
              onChange={(value: [number, number]) => {
                props.setPriceRange(value);
              }}
              marks={[
                { value: 0, label: "0" },
                { value: 100000, label: "100k" },
                { value: 200000, label: "200k" },
                { value: 300000, label: "300k" },
                { value: 400000, label: "400k" },
                { value: 500000, label: "500k" },
              ]}
            ></RangeSlider>
          </div>
          <div className={styles.filter_slider_container}>
            <label
              className={styles.label_text}
              htmlFor={`hotelRatingRange-${searchPanelId}`}
            >
              Đánh giá
            </label>

            <RangeSlider
              id={`hotelRatingRange-${searchPanelId}`}
              defaultValue={[1, 5]}
              value={
                props.ratingRange && props.ratingRange[0]
                  ? props.ratingRange
                  : undefined
              }
              onChange={(value: [number, number]) => {
                props.setRatingRange(value);
              }}
              min={1}
              max={5}
              minRange={0.5}
              step={0.5}
              marks={[
                { value: 1, label: "1" },
                { value: 2, label: "2" },
                { value: 3, label: "3" },
                { value: 4, label: "4" },
                { value: 5, label: "5" },
              ]}
            ></RangeSlider>
          </div>
          <div className={styles.filter_button}>
            <MantineButton fullWidth onClick={() => props.performSearch()}>
              Tìm kiếm
            </MantineButton>
          </div>
        </div>
      </div>
    </CardDefault>
  );
}
