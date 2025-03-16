import { Role } from "@prisma/client";

export interface UserCreateDto {
  username: string;
  password?: string;
  full_name: string;
  email: string;
  phone_number: string;
  role?: Role;
  is_active?: boolean;

  hotel_id?: string | undefined;
}

export interface StaffCreateDto {
  username: string;
  password?: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  role?: Role;
  isActive?: boolean;

  hotel_id: string;
}
