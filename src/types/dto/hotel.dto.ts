import { AddressType } from "../address.interface";
import { UploadedImageDto } from "./image.dto";

interface HotelPutDto {
  name: string;
  address: AddressType;
  images: UploadedImageDto[];
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

export type { HotelPutDto, HotelFormCreateProps, HotelCreateDto };
