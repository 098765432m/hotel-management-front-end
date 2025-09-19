import { Status_Room, Rating } from "@prisma/client";
import { AddressType } from "../address.interface";
import { RoomTypeCustomerFetchDto } from "./room-types.dto";

interface HotelPutDto {
  name: string;
  address: AddressType;
}

interface HotelFormCreateProps {
  name: string;
  street: string;
  ward: string[];
  district: string[];
  province: string[];
}

interface HotelCreateDto {
  name: string;
  address: AddressType;
}

interface HotelContactCreateDto extends AddressType {
  hotel_name: string;
  full_name: string;
  email: string;
  phone_number: string;
  note?: string;
}

// main-page
export interface HotelCustomerPageDto {
  id: string;
  name: string;
  address: string;
  description?: string;
  average_rating: number;

  ratings?: Rating[];
  rooms?: {
    name: string;
    status_room: Status_Room;
    room_type_id: string;
  }[];
  room_types?: RoomTypeCustomerFetchDto[];
  images: {
    id: string;
    public_id: string;
    format: string;
  }[];
}

interface FilterHotel {
  hotel_id: string;
  hotel_name: string;
  hotel_des: string;
  hotel_address: string;
  min_price: number;
  hotel_rating: number;
  image_public_id: string;
  image_format: string;
}

export type {
  HotelPutDto,
  HotelFormCreateProps,
  HotelCreateDto,
  HotelContactCreateDto,
  FilterHotel,
};
