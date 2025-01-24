import { prisma } from "@/lib/client";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { hotel_id: string } }
) {
  const rooms = await prisma.room.findMany({
    where: {
      hotel_id: params.hotel_id,
    },
    include: {
      room_type: true,
    },
    orderBy: {
      name: "asc",
    },
  });

  return NextResponse.json(rooms);
}
