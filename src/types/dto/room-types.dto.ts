import { Prisma } from "@prisma/client";

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
