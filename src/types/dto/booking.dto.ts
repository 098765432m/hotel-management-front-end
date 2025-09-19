import { BookingState } from "@/components/customer/hotel-page/AvailableRooms";
import { Prisma, Status_Booking } from "@prisma/client";

export interface BookingsDtoCreate {
  checkInDate: string;
  checkOutDate: string;
  bookingRoomTypeList: (string | number)[][];
  hotelId: string;
  status?: Status_Booking;
  userId?: string;
  fullName: string;
  phoneNumber: string;
}

export interface BookingsDashboardDtoCreate {
  checkInDate: string;
  checkOutDate: string;
  roomId: string;
  status: Status_Booking;
  userId?: string | null;
  fullName: string;
  phoneNumber: string;
}

export interface BookingsDashboardDtoUpdate {
  checkInDate: string;
  checkOutDate: string;
  roomId: string;
}

export interface GetBookingsByUserDtoResponse {
  id: string;
  check_in_date: string;
  check_out_date: string;
  hotel_id: string;
  hotel_name: string;
  room_type_name: string;
  room_id: string;
  room_name: string;
  price: number;
  status: Status_Booking;
}
