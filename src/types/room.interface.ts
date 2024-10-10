import { RoomTypes, Status_Room } from "@prisma/client";
import { Hotel } from "./hotel.interface";

export interface Room {
  id: string;
  name: string;
  description?: string;
  status_room?: Status_Room;

  hotel_id: string;
  hotel: Hotel;

  room_type_id: string;
  room_type?: RoomTypes;
}
