import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { room_id: string } }
) {
  const prisma = new PrismaClient();

  const room = await prisma.room.findFirst({
    where: {
      id: params.room_id,
    },
  });

  return NextResponse.json(room);
}
