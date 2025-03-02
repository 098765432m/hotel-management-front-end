import { prisma } from "@/lib/client";
import { handleNextApiError } from "@/lib/error-handler/errorHandler";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  {
    params,
  }: {
    params: {
      hotelId: string;
    };
  }
) {
  try {
    const hotelId = params.hotelId;
    const totalRooms = await prisma.room.count({
      where: {
        hotel_id: hotelId,
      },
    });

    return NextResponse.json(
      { success: true, data: totalRooms },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return handleNextApiError(error);
  }
}
