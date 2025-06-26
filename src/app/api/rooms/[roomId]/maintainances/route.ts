import { prisma } from "@/lib/client";
import { MaintainaceCreateRequest } from "@/types/dto/maintainance/maintainanceCreate.dto";
import { NextResponse } from "next/server";

export async function POST(
  request: Request,
  { params }: { params: { roomId: string } }
) {
  const body: MaintainaceCreateRequest = await request.json();
  const roomId = params.roomId;
  await prisma.maintainance.create({
    data: {
      date_start: body.dateStart,
      date_expire: body.dateExpire,
      room_id: roomId,
    },
  });

  return NextResponse.json(null, { status: 201 });
}
