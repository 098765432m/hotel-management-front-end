import { Role } from "@prisma/client";
import { string } from "zod";

interface UserCookieResponse {
  id: string;
  username: string;
  role: string;
  hotelId?: string | null;
}

interface UserGetResponseDto {
  id: string;
  username: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  role: string;
  hotelId?: string;
}

interface UserUpdateResponse {
  username: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  role: string;
  hotelId?: string | null;
}

interface UserUpdateDto {
  username: string;
  password?: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  role?: Role;
  isActive?: boolean;
}

interface StaffOfHotelDto {
  id: string;
  username: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  role: string;
  image: {
    public_id: string;
    format: string;
  };
}

export type {
  UserCookieResponse,
  UserGetResponseDto,
  UserUpdateResponse,
  UserUpdateDto,
  StaffOfHotelDto,
};
