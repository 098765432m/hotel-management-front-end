interface UserCookieResponse {
  id: string;
  username: string;
  role: string;
  hotelId?: string | null;
}

interface UserUpdateResponse {
  username: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  role: string;
  hotelId?: string | null;
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

export type { UserCookieResponse, UserUpdateResponse, StaffOfHotelDto };
