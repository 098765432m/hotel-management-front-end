"use client";

import styles from "@/styles/customer/search-result/SearchResultPage.module.scss";
import globalStyle from "@/styles/global.module.scss";
import CardDefault from "@/components/custom-component/CardDefault";
import MantineButton from "@/components/custom-component/MantineButton";
import { RangeSlider, Select, TextInput } from "@mantine/core";
import { DatesRangeValue, DateValue } from "@mantine/dates";
import MantineDatePicker from "@/components/custom-component/date-picker/MantineDatePicker";
import { useId } from "react";
import { FilterHotelForm } from "@/types/pages/searchResultPage.interface";

interface Province {
  label: string;
  value: string;
}

interface Props {
  formValues: FilterHotelForm;
  setFormValues: any;
  listProvince: Province[] | undefined;
  onSearchClick: (params: FilterHotelForm) => Promise<void>;
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
              value={props.formValues.hotelName ?? ""}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                const value = e.currentTarget.value;

                props.setFormValues((prev: FilterHotelForm) => ({
                  ...prev,
                  hotelName: value,
                }));
              }}
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
              value={props.formValues.provinceName ?? ""}
              onChange={(value: string | null) => {
                props.setFormValues((prev: FilterHotelForm) => ({
                  ...prev,
                  provinceName: value,
                }));
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
              defaultValue={props.formValues.filterDateRange}
              onChange={(value: DatesRangeValue | DateValue | Date[]) => {
                if (Array.isArray(value) && value.length === 2) {
                  // setField({
                  //   key: "filterDateRange",
                  //   value: value as DatesRangeValue,
                  // });
                  // props.setFilterDateRange(value as DatesRangeValue);
                  props.setFormValues((prev: FilterHotelForm) => ({
                    ...prev,
                    filterDateRange: value,
                  }));
                } else {
                  // setField({ key: "filterDateRange", value: [null, null] });
                  // props.setFilterDateRange([null, null]);
                  props.setFormValues((prev: FilterHotelForm) => ({
                    ...prev,
                    filterDateRange: [null, null],
                  }));
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
                props.formValues.priceRange && props.formValues.priceRange[0]
                  ? props.formValues.priceRange
                  : undefined
              }
              onChange={(value: [number, number]) => {
                props.setFormValues((prev: FilterHotelForm) => ({
                  ...prev,
                  priceRange: value,
                }));
              }}
              marks={[
                {
                  value: 0,
                  label: <span className={globalStyle.mark_label_text}>0</span>,
                },
                {
                  value: 100000,
                  label: (
                    <span className={globalStyle.mark_label_text}>100k</span>
                  ),
                },
                {
                  value: 200000,
                  label: (
                    <span className={globalStyle.mark_label_text}>200k</span>
                  ),
                },
                {
                  value: 300000,
                  label: (
                    <span className={globalStyle.mark_label_text}>300k</span>
                  ),
                },
                {
                  value: 400000,
                  label: (
                    <span className={globalStyle.mark_label_text}>400k</span>
                  ),
                },
                {
                  value: 500000,
                  label: (
                    <span className={globalStyle.mark_label_text}>500k</span>
                  ),
                },
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
                props.formValues.ratingRange && props.formValues.ratingRange[0]
                  ? props.formValues.ratingRange
                  : undefined
              }
              onChange={(value: [number, number]) => {
                props.setFormValues((prev: FilterHotelForm) => ({
                  ...prev,
                  ratingRange: value,
                }));
              }}
              min={1}
              max={5}
              minRange={0.5}
              step={0.5}
              marks={[
                {
                  value: 1,
                  label: <span className={globalStyle.mark_label_text}>1</span>,
                },
                {
                  value: 2,
                  label: <span className={globalStyle.mark_label_text}>2</span>,
                },
                {
                  value: 3,
                  label: <span className={globalStyle.mark_label_text}>3</span>,
                },
                {
                  value: 4,
                  label: <span className={globalStyle.mark_label_text}>4</span>,
                },
                {
                  value: 5,
                  label: <span className={globalStyle.mark_label_text}>5</span>,
                },
              ]}
            ></RangeSlider>
          </div>
          <div className={styles.filter_button}>
            <MantineButton
              fullWidth
              onClick={() => props.onSearchClick(props.formValues)}
            >
              Tìm kiếm
            </MantineButton>
          </div>
        </div>
      </div>
    </CardDefault>
  );
}
