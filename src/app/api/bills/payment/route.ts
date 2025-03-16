import { prisma } from "@/lib/client";
import { handleNextApiError } from "@/lib/error-handler/errorHandler";
import { BillDtoDashboardCreate } from "@/types/dto/bill.dto";
import { Status_Booking, Status_Room } from "@prisma/client";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body: BillDtoDashboardCreate = await request.json();

    const { booking_id, room_type_id, ...billBody } = body;

    await prisma.$transaction([
      prisma.bill.create({
        data: { ...billBody },
      }),

      prisma.room.update({
        where: {
          name_room_type_id: {
            name: body.room_name,
            room_type_id: body.room_type_id,
          },
        },
        data: {
          status_room: Status_Room.AVAILABLE,
          current_booking: {
            disconnect: true,
          },
        },
      }),

      prisma.booking.update({
        where: {
          id: body.booking_id,
        },
        data: {
          status: Status_Booking.PAID,
          current_room: {
            disconnect: true,
          },
        },
      }),
    ]);

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    console.error(error);
    return handleNextApiError(error);
  }
}
