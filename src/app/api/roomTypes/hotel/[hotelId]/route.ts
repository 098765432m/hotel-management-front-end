import { prisma } from "@/lib/client";
import { handleNextApiError } from "@/lib/error-handler/errorHandler";
import CustomError from "@/lib/error-handler/errors";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { hotelId: string } }
) {
  try {
    const roomTypes = await prisma.roomType.findMany({
      where: {
        hotel_id: params.hotelId,
      },
      include: {
        images: true,
      },
      orderBy: {
        name: "asc",
      },
    });

    return NextResponse.json(roomTypes);
  } catch (error) {
    return handleNextApiError(error);
  }
}
