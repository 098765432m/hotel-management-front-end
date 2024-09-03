import { Status_Booking } from "@prisma/client";

export interface BookingsDtoCreate {
  check_in_date: Date;
  check_out_date: Date;
  status: Status_Booking;
  room_id: string;
  user_id?: string | null;
  fullName?: string | null;
  phoneNumber?: string | null;
}
