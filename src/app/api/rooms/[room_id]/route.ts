import { NextResponse } from "next/server";
import { prisma } from "@/lib/client";
import { RoomDtoUpdateRequest } from "@/types/dto/room.dto";
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

export async function PUT(
  req: Request,
  { params }: { params: { room_id: string } }
) {
  const body: RoomDtoUpdateRequest = await req.json();

  const updatedRoom = await prisma.room.update({
    where: {
      id: params.room_id,
    },
    data: body,
  });

  return NextResponse.json(updatedRoom);
}

export async function DELETE(
  req: Request,
  { params }: { params: { room_id: string } }
) {
  const deletedRoom = await prisma.room.delete({
    where: {
      id: params.room_id,
    },
  });

  return NextResponse.json(deletedRoom);
}
