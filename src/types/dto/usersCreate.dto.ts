import { Role } from "@prisma/client";

export interface UserCreateDto {
  username: string;
  password: string;
  fullName: string;
  email: string;
  role?: Role;
  isActive?: boolean;

  hotel_id?: string;
}
