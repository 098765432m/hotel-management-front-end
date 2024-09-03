import { Status_Booking } from "@prisma/client";

export interface Booking {
  id: string;
  room_id: string;
  check_in_date: Date;
  check_out_date: Date;
  status?: Status_Booking;

  //User có tài khoản hoặc không user_id - fullName + phoneNumber
  user_id?: string;
  fullName?: string;
  phoneNumber?: string;
}
