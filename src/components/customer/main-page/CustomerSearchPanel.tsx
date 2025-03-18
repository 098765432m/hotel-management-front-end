"use client";

import CardDefault from "@/components/custom-component/CardDefault";
import MantineDatePicker from "@/components/custom-component/date-picker/MantineDatePicker";
import MantineButton from "@/components/custom-component/MantineButton";
import styles from "@/styles/customer/main-page/CustomerSearchPanel.module.scss";
import { RangeSlider, Select, TextInput } from "@mantine/core";
import { DatesRangeValue, DateValue } from "@mantine/dates";
import { useRouter, useSearchParams } from "next/navigation";
import { useId, useState } from "react";
import { FaMagnifyingGlass } from "react-icons/fa6";

interface Province {
  label: string;
  value: string;
}

interface Props {
  listProvince: Province[] | undefined;
}

export default function CustomerSearchPanel({ listProvince }: Props) {
  const inputId = useId();
  const router = useRouter();
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 500000]);
  const [hotelName, setHotelName] = useState("");
  const [selectedProvince, setSelectedProvince] = useState<string | null>("");
  const [filterDateRange, setFilterDateRange] = useState<
    DatesRangeValue | [null, null]
  >([null, null]);

  return (
    <div className={styles.search_panel_container}>
      <div className={styles.search_panel_inner_container}>
        <div className={styles.page_name_container}>
          <h1>Trip.com</h1>
        </div>
        <div className={styles.search_panel}>
          <div className={styles.province_select_container}>
            <label
              className={styles.label_text}
              htmlFor={`province_${inputId}`}
            >
              Khu vực
            </label>
            <Select
              id={`province_${inputId}`}
              value={selectedProvince}
              onChange={setSelectedProvince}
              data={[{ label: "Tất cả", value: "" }, ...(listProvince ?? [])]}
              placeholder="Chọn tỉnh thành"
            ></Select>
          </div>
          <div className={styles.range_slider_container}>
            <label
              className={styles.label_text}
              htmlFor={`priceRange_${inputId}`}
            >
              Giá (phòng/đêm)
            </label>
            <RangeSlider
              id={`priceRange_${inputId}`}
              min={0}
              max={500000}
              step={50000}
              minRange={50000}
              defaultValue={priceRange ?? undefined}
              onChange={(value: [number, number]) => setPriceRange(value)}
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
          <div className={styles.hotel_name_input}>
            <label
              className={styles.label_text}
              htmlFor={`hotelName_${inputId}`}
            >
              Tên khách sạn
            </label>
            <TextInput
              id={`hotelName_${inputId}`}
              value={hotelName}
              onChange={(event) => setHotelName(event.currentTarget.value)}
              placeholder="Tên khách sạn"
            ></TextInput>
          </div>
          <div className={styles.date_range_input_container}>
            <label
              className={styles.label_text}
              htmlFor={`dateRange_${inputId}`}
            >
              Chọn ngày tra cứu
            </label>
            <div className={styles.date_range_input_flex}>
              <div className={styles.date_range_input}>
                <MantineDatePicker
                  id={`dateRange_${inputId}`}
                  placeholder="Chọn ngày tra cứu"
                  type="range"
                  defaultValue={[null, null]}
                  onChange={(value: DatesRangeValue | DateValue | Date[]) => {
                    if (Array.isArray(value) && value.length === 2) {
                      setFilterDateRange(value as DatesRangeValue);
                    } else setFilterDateRange([null, null]);
                  }}
                ></MantineDatePicker>
              </div>
              <div className={styles.search_button}>
                <MantineButton
                  onClick={() => {
                    router.push(
                      `/search-result?hotelName=${hotelName}&rangePrice=${JSON.stringify(
                        priceRange
                      )}&provinceId=${encodeURIComponent(
                        selectedProvince as string
                      )}&filterDateRange=${encodeURIComponent(
                        JSON.stringify(
                          filterDateRange.map(
                            (date) => date?.toISOString() ?? null
                          )
                        )
                      )}`
                    );
                  }}
                >
                  <FaMagnifyingGlass></FaMagnifyingGlass>
                </MantineButton>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
