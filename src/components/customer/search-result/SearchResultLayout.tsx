"use client";

import { useEffect, useState } from "react";
import SearchPanel from "./search-panel/SearchPanel";
import SearchResultList from "./search-result-list/SearchResultList";
import { useSearchParams } from "next/navigation";
import hotelsService from "@/services/hotels.service";
import { DatesRangeValue } from "@mantine/dates";
import {
  FilterHotelForm,
  searchHotelFormInitiaState,
} from "@/types/pages/searchResultPage.interface";
import { GetFilterHotel } from "@/lib/action/hotel.action";
import dayjs from "dayjs";
import { FilterHotel } from "@/types/dto/hotel.dto";

interface Province {
  label: string;
  value: string;
}

interface Props {
  listProvince: Province[] | undefined;
}

// interface HotelResultCardDto {
//   hotelId: string;
//   hotelName: string;
//   hotelDescription: string;
//   hotelAddress: AddressType;
//   hotelRating: number;
//   hotalMinPrice: number;
//   hotalMaxPrice: number;
//   imagePublicId: string;
//   imageFormat: string;
// }

export default function SearchResultLayout({ listProvince }: Props) {
  // Query params

  // TODO Send Search param as initial search
  const searchParam = useSearchParams();
  const hotelNameParam = searchParam.get("hotelName") as string;
  const priceRangeParam = searchParam.get("rangePrice")
    ? JSON.parse(searchParam.get("rangePrice") as string)
    : null;
  const provinceParam = searchParam.get("provinceName");

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
  const [formValues, setFormvalues] = useState<FilterHotelForm>({
    hotelName: hotelNameParam,
    priceRange: priceRangeParam,
    provinceName: decondedProvinceParam,
    filterDateRange: decondedFilterDateRangeParam,
    ratingRange: searchHotelFormInitiaState.ratingRange,
  });

  const [filterHotels, setFilterHotels] = useState<FilterHotel[]>([]);
  // Input state End

  async function searchHotel(params: FilterHotelForm): Promise<FilterHotel[]> {
    try {
      const hotels: FilterHotel[] = await GetFilterHotel(
        formValues.hotelName,
        formValues.provinceName ?? "",
        dayjs(formValues.filterDateRange[0]).toDate(),
        dayjs(formValues.filterDateRange[1]).toDate(),
        formValues.priceRange[0] ?? 0,
        formValues.priceRange[1] ?? 0
      );

      console.log("Filter Hotels Result: ", hotels);

      return hotels;
    } catch (error) {
      console.log("This Is BIg ERROR");
    }

    return [];
  }

  const handleSearchEvent = async (params: FilterHotelForm) => {
    console.log(params);

    const hotels = await searchHotel(params);
    setFilterHotels(hotels);
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
        filterHotels={filterHotels}
      ></SearchResultList>
    </>
  );
}
