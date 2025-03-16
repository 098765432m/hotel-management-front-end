//  /ratings

import { Prisma } from "@prisma/client";
import { ApiResponse } from "../common/api-response";

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
