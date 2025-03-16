import { Prisma } from "@prisma/client";
import { ApiResponse } from "../common/api-response";

export interface BillDtoDashboardCreate extends Prisma.BillCreateInput {
  room_type_id: string;
  booking_id: string;
}

// GET customer

export interface BillCustomerPayload extends Prisma.BillGetPayload<null> {}

export type BillCustomerApiResponse = ApiResponse<{
  bills: BillCustomerPayload[];
  totalBill: number;
}>;
// GET customer END
