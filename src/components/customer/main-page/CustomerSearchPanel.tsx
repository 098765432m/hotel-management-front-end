"use client";

import MantineDatePicker from "@/components/custom-component/date-picker/MantineDatePicker";
import MantineButton from "@/components/custom-component/MantineButton";
import styles from "@/styles/customer/main-page/CustomerSearchPanel.module.scss";
import { RangeSlider, Select, TextInput } from "@mantine/core";
import { DatesRangeValue, DateValue } from "@mantine/dates";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { FaMagnifyingGlass } from "react-icons/fa6";

interface Province {
  label: string;
  value: string;
}

interface Props {
  listProvince: Province[] | undefined;
}

export default function CustomerSearchPanel({ listProvince }: Props) {
  const router = useRouter();
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 8000000]);
  const [hotelName, setHotelName] = useState("");
  const [selectedProvince, setSelectedProvince] = useState<string | null>("");
  const [filterDateRange, setFilterDateRange] = useState<
    DatesRangeValue | [null, null]
  >([null, null]);

  return (
    <div className={styles.search_panel}>
      <div className={styles.upper_panel}>
        <div className={styles.province_select_container}>
          <Select
            value={selectedProvince}
            onChange={setSelectedProvince}
            data={[{ label: "Tất cả", value: "" }, ...(listProvince ?? [])]}
            placeholder="Chọn tỉnh thành"
          ></Select>
        </div>
        <div className={styles.range_slider_container}>
          <RangeSlider
            min={0}
            max={8000000}
            step={500000}
            minRange={500000}
            value={priceRange ?? undefined}
            onChange={setPriceRange}
            marks={[
              { value: 0, label: "0" },
              { value: 2000000, label: "2 tr" },
              { value: 4000000, label: "4 tr" },
              { value: 6000000, label: "6 tr" },
              { value: 8000000, label: "8 tr" },
            ]}
          ></RangeSlider>
        </div>
      </div>
      <span className={styles.bottom_panel}>
        <span className={styles.search_bar_container}>
          <TextInput
            value={hotelName}
            onChange={(event) => setHotelName(event.currentTarget.value)}
            placeholder="Tên khách sạn"
          ></TextInput>
          <MantineDatePicker
            placeholder="Chọn ngày tra cứu"
            type="range"
            defaultValue={[null, null]}
            onChange={(value: DatesRangeValue | DateValue | Date[]) => {
              if (Array.isArray(value) && value.length === 2) {
                setFilterDateRange(value as DatesRangeValue);
              } else setFilterDateRange([null, null]);
            }}
          ></MantineDatePicker>
        </span>
        <MantineButton
          onClick={() => {
            router.push(
              `/search-result?hotelName=${hotelName}&rangePrice=${JSON.stringify(
                priceRange
              )}&provinceId=${encodeURIComponent(
                selectedProvince as string
              )}&filterDateRange=${encodeURIComponent(
                JSON.stringify(
                  filterDateRange.map((date) => date?.toISOString() ?? null)
                )
              )}`
            );
          }}
        >
          <FaMagnifyingGlass></FaMagnifyingGlass>
        </MantineButton>
      </span>
    </div>
  );
}
