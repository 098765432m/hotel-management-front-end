"use client";

import { useCallback, useEffect, useState } from "react";
import SearchPanel from "./search-panel/SearchPanel";
import SearchResultList from "./search-result-list/SearchResultList";
import { HotelResultCardDto } from "@/types/dto/hotel.dto";
import { useSearchParams } from "next/navigation";
import hotelsService from "@/services/hotels.service";
import { DatesRangeValue } from "@mantine/dates";

interface Province {
  label: string;
  value: string;
}

interface Props {
  listProvince: Province[] | undefined;
}

export default function SearchResultLayout({ listProvince }: Props) {
  // Query params
  const searchParam = useSearchParams();
  const hotelNameParam = searchParam.get("hotelName");
  const rangePriceParam = searchParam.get("rangePrice")
    ? JSON.parse(searchParam.get("rangePrice") as string)
    : null;
  const provinceParam = searchParam.get("provinceId");

  const decondedProvinceParam: string | null = provinceParam
    ? decodeURIComponent(provinceParam)
    : null;
  const filterDateRangeQuery = searchParam.get("filterDateRange");

  const decondedFilterDateRangeParam: DatesRangeValue | [null, null] =
    filterDateRangeQuery
      ? ((
          JSON.parse(decodeURIComponent(filterDateRangeQuery)) as [
            string,
            string
          ]
        ).map((date) => (date ? new Date(date) : null)) as DatesRangeValue)
      : [null, null];

  // console.log("hotelNameParams", searchParam.get("hotelName"));
  // console.log("price", searchParam.get("rangePrice"));
  // console.log("provinceId", decondedProvinceParam ?? "none");

  // Query params End

  // Input state
  const [hotelName, setHotelName] = useState<string>(hotelNameParam ?? "");
  const [priceRange, setPriceRange] = useState<[number, number] | [null, null]>(
    rangePriceParam
  );
  const [ratingRange, setRatingRange] = useState<
    [number, number] | [null, null]
  >([null, null]);
  const [filterDateRange, setFilterDateRange] = useState<
    DatesRangeValue | [null, null]
  >(decondedFilterDateRangeParam);
  const [provinceId, setProvinceId] = useState<string | null>(
    decondedProvinceParam
  );
  // Input state End

  const [resultHotel, setResultHotel] = useState<HotelResultCardDto[]>([]);
  const [isSearching, setIsSearching] = useState<boolean>(false);

  async function searchHotel(
    hotelName: string,
    priceRange: [number, number] | [null, null],
    ratingRange: [number, number] | [null, null],
    provinceId: string
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
      provinceId ?? ""
      //Thêm filterDateRange
    );

    console.log("hotel", result);

    setResultHotel(result);

    setIsSearching(false);
  }, [hotelName, priceRange, ratingRange, provinceId]);

  useEffect(() => {
    performSearch();
  }, [performSearch]);

  return (
    <>
      <SearchPanel
        hotelName={hotelName}
        setHotelName={setHotelName}
        priceRange={priceRange}
        setPriceRange={setPriceRange}
        ratingRange={ratingRange}
        setRatingRange={setRatingRange}
        filterDateRange={filterDateRange}
        setFilterDateRange={setFilterDateRange}
        provinceId={provinceId}
        setProvinceId={setProvinceId}
        listProvince={listProvince}
        performSearch={performSearch}
      ></SearchPanel>
      <SearchResultList
        isSearching={isSearching}
        filterDateRange={filterDateRange}
        resultHotel={resultHotel}
      ></SearchResultList>
    </>
  );
}
