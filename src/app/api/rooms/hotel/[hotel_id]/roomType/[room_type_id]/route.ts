import { prisma } from "@/lib/client";
import { handleNextApiError } from "@/lib/error-handler/errorHandler";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  {
    params,
  }: {
    params: {
      hotel_id: string;
      room_type_id: string;
    };
  }
) {
  try {
    const rooms = await prisma.room.findMany({
      where: {
        hotel_id: params.hotel_id,
        room_type_id: params.room_type_id,
      },

      select: {
        id: true,
        name: true,
      },
    });

    return NextResponse.json(rooms);
  } catch (error) {
    console.error(error);
    return handleNextApiError(error);
  }
}
