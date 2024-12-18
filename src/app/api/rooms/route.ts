import { NextResponse } from "next/server";
import { prisma } from "@/lib/client";

export async function GET() {
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
  const body = await request.json();

  console.log(body);

  // const result = await prisma.room.create({
  //   data: body,
  // });

  return NextResponse.json("");
  // return NextResponse.json(result);
}
