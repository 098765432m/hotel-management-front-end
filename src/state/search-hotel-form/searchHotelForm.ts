import { DatesRangeValue } from "@mantine/dates";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface SearchHotelFormState {
  hotelName: string;
  priceRange: [number, number] | [null, null];
  ratingRange: [number, number] | [null, null];
  filterDateRange: DatesRangeValue | [null, null];
  provinceId: string | null;
  //   listProvince: Province[] | undefined;
}

const initialState: SearchHotelFormState = {
  hotelName: "",
  priceRange: [0, 0],
  ratingRange: [1, 5],
  filterDateRange: [null, null],
  provinceId: null,
  //   listProvince: undefined,
};

const searchHotelFormSlice = createSlice({
  name: "seachHotelForm",
  initialState,
  reducers: {
    setField: <K extends keyof SearchHotelFormState>(
      state: SearchHotelFormState,
      action: PayloadAction<{ key: K; value: SearchHotelFormState[K] }>
    ) => {
      state[action.payload.key] = action.payload.value;
    },
    // setHotelName: (state, action: PayloadAction<string>) => {
    //   state.hotelName = action.payload;
    // },
    // setPriceRange: (
    //   state,
    //   action: PayloadAction<[number, number] | [null, null]>
    // ) => {
    //   state.priceRange = action.payload;
    // },
    // setRatingRange: (
    //   state,
    //   action: PayloadAction<[number, number] | [null, null]>
    // ) => {
    //   state.ratingRange = action.payload;
    // },
    // setFilterDateRange: (
    //   state,
    //   action: PayloadAction<DatesRangeValue | [null, null]>
    // ) => {
    //   state.filterDateRange = action.payload;
    // },
    // setProvinceId: (state, action: PayloadAction<string | null>) => {
    //   state.provinceId = action.payload;
    // },
    // setListProvince: (state, action: PayloadAction<Province[] | undefined>) => {
    //   state.listProvince = action.payload;
    // },
  },
});

export const { setField } = searchHotelFormSlice.actions;

export default searchHotelFormSlice.reducer;
