import { prisma } from "@/lib/client";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { hotelId: string } }
) {
  const roomTypes = await prisma.roomType.findMany({
    where: {
      hotel_id: params.hotelId,
    },
    include: {
      images: true,
    },
  });

  return NextResponse.json(roomTypes);
}
