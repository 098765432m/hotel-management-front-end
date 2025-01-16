import { Status_Room } from "@prisma/client";

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
