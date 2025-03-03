import { Prisma } from "@prisma/client";
import { ApiResponse } from "../common/api-response";

export interface RoomTypeUpdateDto {
  name: string;
  price: number;
  images: {
    public_id: string;
    format: string;
    room_type_id: string;
  }[];
}

export interface GetRoomTypeBookingDtoResponse
  extends Prisma.RoomTypeGetPayload<{ include: { rooms: true } }> {}

export type RoomTypeCustomerFetchDto = {
  name: string;
  price: number;
};

// GET /hotel/[hotelId]
export interface RoomTypeHotelPayload
  extends Prisma.RoomTypeGetPayload<{ include: { images: true } }> {}

export type RoomTypeHotelApiResponse = ApiResponse<{
  roomTypes: RoomTypeHotelPayload[];
  totalRoomType: number;
}>;
