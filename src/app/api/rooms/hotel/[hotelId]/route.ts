import { prisma } from "@/lib/client";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { hotelId: string } }
) {
  const rooms = await prisma.room.findMany({
    where: {
      hotel_id: params.hotelId,
    },
    include: {
      room_type: true,
      bookings: true,
      current_booking: true,
    },
    orderBy: {
      name: "asc",
    },
  });

  return NextResponse.json(rooms);
}
