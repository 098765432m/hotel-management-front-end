"use client";

import MantineButton from "@/components/custom-component/MantineButton";
import styles from "@/styles/customer/main-page/CustomerSearchPanel.module.scss";
import { RangeSlider, Select, TextInput } from "@mantine/core";
import { useRouter } from "next/navigation";
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
  const [rangePrice, setRangePrice] = useState<[number, number]>([20, 80]);
  const [hotelName, setHotelName] = useState("");
  const [selectedProvince, setSelectedProvince] = useState<string | null>("");
  console.log(selectedProvince as string);

  return (
    <div className={styles.search_panel}>
      <div className={styles.upper_panel}>
        <div className={styles.province_select_container}>
          <Select
            value={selectedProvince}
            onChange={setSelectedProvince}
            data={listProvince}
          ></Select>
        </div>
        <div className={styles.range_slider_container}>
          <RangeSlider
            value={rangePrice}
            onChange={setRangePrice}
          ></RangeSlider>
          ({rangePrice[0]} - {rangePrice[1]})
        </div>
      </div>
      <span className={styles.bottom_panel}>
        <span className={styles.search_bar_container}>
          <TextInput
            value={hotelName}
            onChange={(event) => setHotelName(event.currentTarget.value)}
            placeholder="Tên khách sạn"
          ></TextInput>
        </span>
        <MantineButton
          onClick={() => {
            router.push(
              `/search-result?hotelName=${hotelName}&rangePrice=${JSON.stringify(
                rangePrice
              )}&provinceId=${encodeURIComponent(selectedProvince as string)}`
            );
          }}
        >
          <FaMagnifyingGlass></FaMagnifyingGlass>
        </MantineButton>
      </span>
    </div>
  );
}
