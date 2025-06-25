"use client";

import { useEffect, useState } from "react";
import SearchPanel from "./search-panel/SearchPanel";
import SearchResultList from "./search-result-list/SearchResultList";
import { HotelResultCardDto } from "@/types/dto/hotel.dto";
import { useSearchParams } from "next/navigation";
import hotelsService from "@/services/hotels.service";
import { DatesRangeValue } from "@mantine/dates";
import {
  SearchHotelForm,
  searchHotelFormInitiaState,
} from "@/types/pages/searchResultPage.interface";

interface Province {
  label: string;
  value: string;
}

interface Props {
  listProvince: Province[] | undefined;
}

export default function SearchResultLayout({ listProvince }: Props) {
  // Query params

  // TODO Send Search param as initial search
  const searchParam = useSearchParams();
  const hotelNameParam = searchParam.get("hotelName") as string;
  const priceRangeParam = searchParam.get("rangePrice")
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

  // Query params End

  // Input state
  const [formValues, setFormvalues] = useState<SearchHotelForm>({
    hotelName: hotelNameParam,
    priceRange: priceRangeParam,
    provinceId: decondedProvinceParam,
    filterDateRange: decondedFilterDateRangeParam,
    ratingRange: searchHotelFormInitiaState.ratingRange,
  });

  const [resultHotel, setResultHotel] = useState<HotelResultCardDto[]>([]);
  // Input state End

  async function searchHotel(params: SearchHotelForm) {
    return await hotelsService.searchHotel(
      params.hotelName,
      params.priceRange,
      params.ratingRange,
      params.provinceId
    );
  }

  const handleSearchEvent = async (params: SearchHotelForm) => {
    console.log(params);

    const hotels = await searchHotel(params);
    setResultHotel(hotels);
  };

  useEffect(() => {
    handleSearchEvent(formValues);
  }, []);

  return (
    <>
      <SearchPanel
        formValues={formValues}
        setFormValues={setFormvalues}
        listProvince={listProvince}
        onSearchClick={handleSearchEvent}
      ></SearchPanel>
      <SearchResultList
        filterDateRange={formValues.filterDateRange}
        resultHotel={resultHotel}
      ></SearchResultList>
    </>
  );
}
