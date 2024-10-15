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
  role: string;
  hotelId?: string | null;
}

export type { UserCookieResponse, UserUpdateResponse };
