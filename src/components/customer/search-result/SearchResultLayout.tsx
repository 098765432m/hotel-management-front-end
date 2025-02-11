"use client";
import { useCallback, useEffect, useState } from "react";
import SearchPanel from "./search-panel/SearchPanel";
import SearchResultList from "./search-result-list/SearchResultList";
import { HotelResultCardDto } from "@/types/dto/hotel.dto";
import { useSearchParams } from "next/navigation";
import hotelsService from "@/services/hotels.service";

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
  }, [hotelName, priceRange, ratingRange, provinceId]);

  useEffect(() => {
    performSearch();
  }, [provinceId, performSearch]);

  return (
    <>
      <SearchPanel
        hotelName={hotelName}
        setHotelName={setHotelName}
        priceRange={priceRange}
        setPriceRange={setPriceRange}
        ratingRange={ratingRange}
        setRatingRange={setRatingRange}
        setProvinceId={setProvinceId}
        listProvince={listProvince}
        performSearch={performSearch}
      ></SearchPanel>
      <SearchResultList
        isSearching={isSearching}
        resultHotel={resultHotel}
      ></SearchResultList>
    </>
  );
}
