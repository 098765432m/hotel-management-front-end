import { DatesRangeValue } from "@mantine/dates";

export interface FilterHotelForm {
  hotelName: string;
  priceRange: [number, number] | [null, null];
  ratingRange: [number, number] | [null, null];
  filterDateRange: DatesRangeValue | [null, null];
  provinceName: string | null;
}

export const searchHotelFormInitiaState: FilterHotelForm = {
  hotelName: "",
  priceRange: [0, 0],
  ratingRange: [1, 5],
  filterDateRange: [null, null],
  provinceName: null,
};
