import { prisma } from "@/lib/client";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { hotelId: string } }
) {
  const staffs = await prisma.user.findMany({
    where: {
      hotel_id: params.hotelId,
    },
    include: {
      image: true,
    },
  });

  return NextResponse.json(staffs);
}
