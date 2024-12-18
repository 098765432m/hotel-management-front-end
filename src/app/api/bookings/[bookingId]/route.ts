import { prisma } from "@/lib/client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { bookingId: string } }
) {
  const booking = await prisma.booking.findFirst({
    where: {
      id: params.bookingId,
    },
  });
  return NextResponse.json(booking);
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { bookingId: string } }
) {
  console.log(params.bookingId);

  const query = request.nextUrl.searchParams;

  const [deletedBooking, updatedBooking] = await prisma.$transaction([
    prisma.booking.delete({
      where: {
        id: params.bookingId,
      },
    }),

    prisma.room.update({
      where: { id: query.get("roomId") as string },
      data: {
        status_room: "AVAILABLE",
      },
    }),
  ]);

  return NextResponse.json([deletedBooking, updatedBooking]);
}
