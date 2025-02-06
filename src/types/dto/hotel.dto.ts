import { AddressType } from "../address.interface";
import { UploadedImageDto } from "./image.dto";

interface HotelPutDto {
  name: string;
  address: AddressType;
  // images: UploadedImageDto[];
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

interface HotelResultCardDto {
  hotelId: string;
  hotelName: string;
  hotelDescription: string;
  hotelAddress: AddressType;
  hotelRating: number;
  hotelPrice: number[];
  hotelImages: UploadedImageDto[];
}

export type {
  HotelPutDto,
  HotelFormCreateProps,
  HotelCreateDto,
  HotelContactCreateDto,
  HotelResultCardDto,
};
