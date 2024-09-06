import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

export async function GET() {
  const prisma = new PrismaClient();
  const rooms = await prisma.room.findMany({
    include: {
      hotel: true,
      room_type: true,
      booking: true,
    },
  });
  return NextResponse.json(rooms);
}

export async function POST(request: Request) {
  const prisma = new PrismaClient();
  const body = await request.json();

  const result = await prisma.room.create({
    data: body,
  });

  return NextResponse.json(result);
}
