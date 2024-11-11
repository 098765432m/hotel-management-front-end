import { prisma } from "@/lib/client";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { hotelId: string } }
) {
  const roomTypes = await prisma.roomTypes.findMany({
    where: {
      hotel_id: params.hotelId,
    },
  });

  return NextResponse.json(roomTypes);
}
