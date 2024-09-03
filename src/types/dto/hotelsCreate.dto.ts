import { Status_Room } from "@prisma/client";
import { JsonValue } from "@prisma/client/runtime/library";
import { Address } from "../address.interface";

export interface HotelsDtoCreate {
  name: string;
  address: Address;
}
