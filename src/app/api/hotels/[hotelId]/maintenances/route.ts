import { prisma } from "@/lib/client";
import { MaintenaceCreateRequest } from "@/types/dto/maintainance/maintainanceCreate.dto";
import { NextResponse } from "next/server";

export async function POST(
  request: Request,
  { params }: { params: { hotelId: string } }
) {
  const body: MaintenaceCreateRequest = await request.json();
  const hotelId = params.hotelId;
  await prisma.maintenance.create({
    data: {
      date_start: body.dateStart,
      date_expire: body.dateExpire,
      hotel_id: hotelId,
    },
  });

  return NextResponse.json(null, { status: 201 });
}
