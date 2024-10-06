import { prisma } from "@/lib/client";
import { NextResponse } from "next/server";

export async function GET() {
  const hotels = await prisma.hotel.findMany({
    include: {
      rooms: true,
      room_types: true,
      users: true,
    },
  });

  return NextResponse.json(hotels);
}

export async function POST(request: Request) {
  const body = await request.json();

  const result = await prisma.hotel.create({
    data: body,
  });

  return NextResponse.json(result);
}
