import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { booking_id: string } }
) {
  const prisma = new PrismaClient();
  const booking = await prisma.booking.findFirst({
    where: {
      id: params.booking_id,
    },
  });
  return NextResponse.json(booking);
}
