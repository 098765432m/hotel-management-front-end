"use server";
import { FilterHotel } from "@/types/dto/hotel.dto";
import { formatDateToDDMMYYYY } from "@/utils/dayjs";
import axios from "axios";
import dayjs from "dayjs";

export async function GetFilterHotel(
  hotelName: string,
  hotelAddress: string,
  checkIn: Date,
  checkOut: Date,
  minPrice: number,
  maxPrice: number
): Promise<FilterHotel[]> {
  console.log("Filter Hotel log");

  console.log(`${process.env.NEXT_PUBLIC_BACKEND_SERVER}/hotels/filter`);

  const result: ApiResponse<FilterHotel[]> = (
    await axios.get(
      `${process.env.NEXT_PUBLIC_BACKEND_SERVER}/api/hotels/filter`,
      {
        params: {
          hotel_name: hotelName,
          address: hotelAddress,
          check_in: formatDateToDDMMYYYY(dayjs(checkIn)),
          check_out: formatDateToDDMMYYYY(dayjs(checkOut)),
          min_price: minPrice,
          max_price: maxPrice,
        },
      }
    )
  ).data;
  console.log(result.result);

  if (!result.result) {
    console.log("Empty");
    return [];
  }

  console.log(result.result);

  return result.result;
}
