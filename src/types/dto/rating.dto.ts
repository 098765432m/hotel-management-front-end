//  /ratings

import { Prisma } from "@prisma/client";
import { ApiResponse } from "../common/api-response";
import { string } from "zod";

// GET /hotel/[hotelId]
export interface RatingHotelPayload
  extends Prisma.RatingGetPayload<{
    include: {
      guest: {
        select: {
          id: true;
          username: true;
          full_name: true;
        };
      };
    };
  }> {}

export type RatingHotelApiResponse = ApiResponse<{
  ratings: RatingHotelPayload[];
}>;

// POST /hotel/[hotelId]
export interface RatingCreateDtoRequest {
  score: number;
  comment?: string | null;
  guestId: string;
}

export interface RatingResponse {
  id: string;
  score: number;
  hotel_id: string;
  user_id: string;
  user: {
    user_id: string;
    username: string;
    image: {
      image_id: string;
      public_id: string;
      format: string;
      user_id: string;
    };
  };
  comment: string;
}
