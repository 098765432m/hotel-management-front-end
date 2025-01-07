"use client";

import styles from "@/styles/customer/search-result/SearchResultComponent.module.scss";
import CardDefault from "@/components/custom-component/CardDefault";
import { RangeSlider, Select, Slider, TextInput } from "@mantine/core";
import MantineButton from "@/components/custom-component/MantineButton";
import { FaMagnifyingGlass } from "react-icons/fa6";
import HotelResultCard from "@/components/customer/search-result/HotelResultCard";
import { useCallback, useEffect, useMemo, useState } from "react";
import hotelsService from "@/services/hotels.service";
import { HotelResultCardDto } from "@/types/dto/hotel.dto";
import { useSearchParams } from "next/navigation";

interface Province {
  label: string;
  value: string;
}

interface Props {
  listProvince: Province[] | undefined;
}

export default function SearchResultComponent({ listProvince }: Props) {
  // Query params
  const searchParam = useSearchParams();
  const hotelNameParam = searchParam.get("hotelName") as string;
  const rangePriceParam = searchParam.get("rangePrice")
    ? JSON.parse(searchParam.get("rangePrice") as string)
    : null;
  const provinceIdParam = decodeURIComponent(
    searchParam.get("provinceId") as string
  );

  // Query params End

  // Input state
  const [hotelName, setHotelName] = useState<string>(hotelNameParam);
  const [priceRange, setPriceRange] = useState<[number, number] | null>(
    rangePriceParam
  );
  const [ratingRange, setRatingRange] = useState<[number, number] | null>(null);
  const [provinceId, setProvinceId] = useState<string>(
    provinceIdParam as string
  );
  // Input state End

  const [resultHotel, setResultHotel] = useState<HotelResultCardDto[]>([]);
  const [isSearching, setIsSearching] = useState<boolean>(false);

  async function searchHotel(
    hotelName: string,
    priceRange: number[] | null,
    ratingRange: number[] | null,
    provinceId: string | null
  ) {
    return await hotelsService.searchHotel(
      hotelName,
      priceRange,
      ratingRange,
      provinceId
    );
  }

  const performSearch = useCallback(async () => {
    setIsSearching(true);
    const result = await searchHotel(
      hotelName,
      priceRange,
      ratingRange,
      provinceId
    );
    setResultHotel(result);

    setIsSearching(false);
  }, [hotelName, priceRange, ratingRange]);

  useEffect(() => {
    performSearch();
  }, []);

  return (
    <div className={styles.search_result}>
      <CardDefault>
        <div className={styles.search_input_container}>
          <div className={styles.text_input_container}>
            <TextInput
              value={hotelName}
              onChange={(event) => setHotelName(event.currentTarget.value)}
              placeholder="Tên khách sạn"
            ></TextInput>
          </div>
          <MantineButton onClick={() => performSearch()}>
            <FaMagnifyingGlass></FaMagnifyingGlass>
          </MantineButton>
        </div>
      </CardDefault>
      <div className={styles.search_result_bottom}>
        <div className={styles.filter_panel}>
          <CardDefault>
            <div>
              Giá <br />
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
              ></RangeSlider>
            </div>
            <div>
              Rating <br />{" "}
              <RangeSlider
                value={ratingRange ?? undefined}
                onChange={(value: [number, number]) => {
                  setRatingRange(value);
                  console.log(value);
                }}
                min={0}
                max={5}
                minRange={0.5}
                step={0.5}
              ></RangeSlider>
            </div>
            {/* <div>Number of guests</div> */}
            <div>
              Tỉnh <br />
              <Select
                data={[{ label: "Tất cả", value: "" }, ...(listProvince ?? [])]}
                onChange={(value: string | null) => {
                  setProvinceId(value as string);
                  console.log(value);
                }}
                placeholder="Chọn tỉnh thành"
              ></Select>
            </div>
          </CardDefault>
        </div>
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
                <div>...</div>
              )}
            </div>
          </CardDefault>
        </div>
      </div>
    </div>
  );
}
