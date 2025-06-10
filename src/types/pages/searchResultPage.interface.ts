import { DatesRangeValue } from "@mantine/dates";

export interface SearchHotelForm {
  hotelName: string;
  priceRange: [number, number] | [null, null];
  ratingRange: [number, number] | [null, null];
  filterDateRange: DatesRangeValue | [null, null];
  provinceId: string | null;
}

export const searchHotelFormInitiaState: SearchHotelForm = {
  hotelName: "",
  priceRange: [0, 0],
  ratingRange: [1, 5],
  filterDateRange: [null, null],
  provinceId: null,
};
