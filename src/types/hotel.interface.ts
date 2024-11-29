import { Image, Room, User } from "@prisma/client";
import { AddressType } from "./address.interface";
import { RoomTypeCustomerFetchDto } from "./dto/room-types.dto";

export interface Hotel {
  id: string;
  name: string;
  address: AddressType;
  description?: string;

  rooms?: Room[];
  room_types?: RoomTypeCustomerFetchDto[];
  users: User[];
  images: Image[];
}
