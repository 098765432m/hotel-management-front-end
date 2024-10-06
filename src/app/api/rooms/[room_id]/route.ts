import { NextResponse } from "next/server";
import { prisma } from "@/lib/client";
export async function GET(
  request: Request,
  { params }: { params: { room_id: string } }
) {
  const room = await prisma.room.findUnique({
    where: {
      id: params.room_id,
    },
    include: {
      hotel: true,
      room_type: true,
      booking: true,
    },
  });

  return NextResponse.json(room);
}
