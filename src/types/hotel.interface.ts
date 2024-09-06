import { Room, RoomTypes, User } from "@prisma/client";
import { Address } from "./address.interface";

export interface Hotel {
  id: string;
  name: string;
  address: Address;

  rooms: Room[];
  room_types: RoomTypes[];
  users: User[];
}
