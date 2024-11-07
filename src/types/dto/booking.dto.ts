import { Status_Booking } from "@prisma/client";

export interface BookingsDtoCreate {
  check_in_date: string;
  check_out_date: string;
  status?: Status_Booking;
  room_id: string;
  user_id?: string | null;
  fullName?: string | null;
  email?: string | null;
  phoneNumber?: string | null;
}
