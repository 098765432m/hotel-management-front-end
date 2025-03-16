import { prisma } from "@/lib/client";
import { handleNextApiError } from "@/lib/error-handler/errorHandler";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  {
    params,
  }: {
    params: {
      hotelId: string;
      roomTypeId: string;
    };
  }
) {
  try {
    const rooms = await prisma.room.findMany({
      where: {
        hotel_id: params.hotelId,
        room_type_id: params.roomTypeId,
      },

      select: {
        id: true,
        name: true,
      },

      orderBy: {
        name: "asc",
      },
    });

    return NextResponse.json(rooms);
  } catch (error) {
    console.error(error);
    return handleNextApiError(error);
  }
}
