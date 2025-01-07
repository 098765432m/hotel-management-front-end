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
  hotelName: string;
  fullName: string;
  email: string;
  phoneNumber: string;
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
