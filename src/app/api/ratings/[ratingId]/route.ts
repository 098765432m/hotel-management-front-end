import { prisma } from "@/lib/client";
import { handleNextApiError } from "@/lib/error-handler/errorHandler";
import { caculateHotelAverageRating } from "@/utils/caculateAverageRating";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(
  req: NextRequest,
  { params }: { params: { ratingId: string } }
) {
  try {
    const ratingId: string = params.ratingId;
    const hotelId = req.nextUrl.searchParams.get("hotelId") as string;

    await prisma.$transaction(async (tx) => {
      await tx.rating.delete({
        where: {
          id: ratingId,
        },
      });

      const newAverageRating = await tx.rating.aggregate({
        where: {
          hotel_id: hotelId,
        },
        _avg: { score: true },
      });

      await tx.hotel.update({
        where: { id: hotelId },
        data: {
          average_rating: newAverageRating._avg.score ?? 0,
        },
      });
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error(error);
    return handleNextApiError(error);
  }
}
