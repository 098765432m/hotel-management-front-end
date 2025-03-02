import { Prisma, Status_Room } from "@prisma/client";
import { ApiResponse } from "../common/api-response";

// **/api/rooms

export interface RoomDtoCreate {
  name: string;
  description?: string;
  status_room?: Status_Room;
  hotel_id: string;
  room_type_id: string;
}

export interface RoomDtoUpdateRequest {
  name: string;
  description?: string;
  room_type_id: string;
}

// GET /hotel/[hotelId]
export interface RoomHotelPayload
  extends Prisma.RoomGetPayload<{
    include: {
      room_type: true;
      bookings: true;
      current_booking: true;
    };
  }> {}

// GET /hotel/[hotelId]
export type RoomHotelListApiResponse = ApiResponse<{
  rooms: RoomHotelPayload[];
  totalRoom: number;
}>;
