import { prisma } from "@/lib/client";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { hotel_id: string } }
) {
  const hotel = await prisma.hotel.findFirst({
    where: {
      id: params.hotel_id,
    },
  });

  return NextResponse.json(hotel);
}
