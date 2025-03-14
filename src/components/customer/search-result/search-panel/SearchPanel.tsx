"use client";

import styles from "@/styles/customer/search-result/SearchResultPage.module.scss";
import CardDefault from "@/components/custom-component/CardDefault";
import MantineButton from "@/components/custom-component/MantineButton";
import { RangeSlider, Select, TextInput } from "@mantine/core";
import { DatesRangeValue, DateValue } from "@mantine/dates";
import MantineDatePicker from "@/components/custom-component/date-picker/MantineDatePicker";

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
  return (
    <CardDefault>
      <div className={styles.search_panel_container}>
        <div className={styles.search_result_heading}>Tìm kiếm</div>
        <div className={styles.filter_input_layout}>
          <div className={styles.filter_hotel_name_container}>
            <div>Tên khách sạn</div>
            <TextInput
              value={props.hotelName ?? ""}
              onChange={(event) =>
                props.setHotelName(event.currentTarget.value)
              }
              placeholder="Tên khách sạn"
              className={styles.search_input}
            ></TextInput>
          </div>
          <div className={styles.filter_address_container}>
            <div>Tỉnh/Thành phố</div>
            <Select
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
            <div>Ngày tra cứu</div>
            <MantineDatePicker
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
            <div>
              <span className="">Giá</span>
            </div>
            <RangeSlider
              defaultValue={[0, 8000000]}
              min={0}
              max={8000000}
              step={500000}
              minRange={500000}
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
              defaultValue={[0, 5]}
              value={
                props.ratingRange && props.ratingRange[0]
                  ? props.ratingRange
                  : undefined
              }
              onChange={(value: [number, number]) => {
                props.setRatingRange(value);
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
