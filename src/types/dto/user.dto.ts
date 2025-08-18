import { Prisma, Role } from "@prisma/client";
import { ApiResponse } from "../common/api-response";

export interface UserRedux {
  id: string;
  username: string;
  email: string;
  role: string;
  hotelId?: string | null;
}

// GET /hotel/[hotelId]
export interface StaffHotelPayload
  extends Omit<
    Prisma.UserGetPayload<{ include: { image: true } }>,
    "password"
  > {}

export type StaffHotelApiResponse = ApiResponse<{
  staffs: StaffHotelPayload[];
  total: number;
}>;

// End

export interface UserGetResponseDto {
  id: string;
  username: string;
  fullName: string;
  phoneNumber: string;
  email: string;
  role: string;
  hotelId?: string;
  image?: {
    public_id: string;
    format: string;
  };
}

export interface UserUpdateResponse {
  username: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  role: string;
  hotelId?: string | null;
}

export interface UserUpdateDto {
  username: string;
  password?: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  role?: Role;
  isActive?: boolean;
}

export interface StaffOfHotelDto {
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
