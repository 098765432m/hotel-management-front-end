"use server";

import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { room_id: string } }
) {
  const prisma = new PrismaClient();

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
