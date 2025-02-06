import { prisma } from "@/lib/client";
import { NextResponse } from "next/server";

export async function GET() {
  const roomTypes = await prisma.roomType.findMany({
    include: {
      hotel: true,
      rooms: true,
      images: true,
    },
  });

  return NextResponse.json(roomTypes);
}

export async function POST(request: Request) {
  const body = await request.json();

  const result = await prisma.roomType.create({
    data: body,
  });

  return NextResponse.json(result);
}
