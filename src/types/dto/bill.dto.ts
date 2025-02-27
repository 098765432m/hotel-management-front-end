import { Prisma } from "@prisma/client";

export interface BillDtoDashboardCreate extends Prisma.BillCreateInput {
  room_type_id: string;
  booking_id: string;
}
