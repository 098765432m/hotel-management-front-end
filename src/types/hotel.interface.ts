import { Room, RoomTypes, User } from "@prisma/client";
import { AddressType } from "./address.interface";

export interface Hotel {
  id: string;
  name: string;
  address: AddressType;

  rooms?: Room[];
  room_types?: RoomTypes[];
  users: User[];
}
