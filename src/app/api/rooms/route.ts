import { NextResponse } from "next/server";
import { prisma } from "@/lib/client";
import { RoomDtoCreate } from "@/types/dto/room.dto";

export async function GET() {
  const rooms = await prisma.room.findMany({
    include: {
      hotel: true,
      room_type: true,
      bookings: true,
    },
  });
  return NextResponse.json(rooms);
}

export async function POST(request: Request) {
  const body: RoomDtoCreate = await request.json();

  const result = await prisma.room.create({
    data: body,
  });
  return NextResponse.json(result);
}
