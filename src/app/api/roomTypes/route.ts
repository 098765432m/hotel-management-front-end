import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

export async function GET() {
  const prisma = new PrismaClient();
  const roomTypes = await prisma.roomTypes.findMany({
    include: {
      hotel: true,
      rooms: true,
    },
  });

  return NextResponse.json(roomTypes);
}

export async function POST(request: Request) {
  const prisma = new PrismaClient();
  const body = await request.json();

  const result = await prisma.roomTypes.create({
    data: body,
  });

  return NextResponse.json(result);
}
