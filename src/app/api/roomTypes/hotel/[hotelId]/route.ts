import { prisma } from "@/lib/client";
import { handleNextApiError } from "@/lib/error-handler/errorHandler";
import CustomError from "@/lib/error-handler/errors";
import { RoomTypeHotelApiResponse } from "@/types/dto/room-types.dto";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { hotelId: string } }
) {
  try {
    const hotelId = params.hotelId;

    const pageQuery = request.nextUrl.searchParams.get("page");

    const limitQuery = request.nextUrl.searchParams.get("limit");

    const pageIndex = pageQuery ? Number(pageQuery) : undefined;

    const limit = limitQuery ? Number(limitQuery) : undefined;

    const pageSkip = limit && pageIndex ? pageIndex * limit : undefined;

    const [roomTypes, totalRoomType] = await Promise.all([
      prisma.roomType.findMany({
        where: {
          hotel_id: params.hotelId,
        },
        include: {
          images: true,
        },
        orderBy: {
          name: "asc",
        },
        skip: pageSkip,
        take: limit,
      }),
      prisma.roomType.count({
        where: {
          hotel_id: hotelId,
        },
      }),
    ]);

    return NextResponse.json<RoomTypeHotelApiResponse>(
      {
        data: {
          roomTypes: roomTypes,
          totalRoomType: totalRoomType,
        },
        success: true,
      },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);

    return handleNextApiError(error);
  }
}
