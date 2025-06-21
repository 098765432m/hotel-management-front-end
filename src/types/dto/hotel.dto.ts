import { Room, Image, Status_Room, Rating } from "@prisma/client";
import { AddressType } from "../address.interface";
import { UploadedImageDto } from "./image.dto";
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
  address: AddressType;
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

interface HotelResultCardDto {
  hotelId: string;
  hotelName: string;
  hotelDescription: string;
  hotelAddress: AddressType;
  hotelRating: number;
  hotalMinPrice: number;
  hotalMaxPrice: number;
  imagePublicId: string;
  imageFormat: string;
}

export type {
  HotelPutDto,
  HotelFormCreateProps,
  HotelCreateDto,
  HotelContactCreateDto,
  HotelResultCardDto,
};
