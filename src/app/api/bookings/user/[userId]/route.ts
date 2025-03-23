import { prisma } from "@/lib/client";
import { GetBookingsByUserDtoResponse } from "@/types/dto/booking.dto";
import dayjs from "dayjs";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  const bookings = await prisma.booking.findMany({
    where: {
      user_id: params.userId,
    },
    include: {
      room: {
        include: {
          hotel: true,
          room_type: true,
        },
      },
    },
    orderBy: {
      check_in_date: "asc",
    },
  });

  const response: GetBookingsByUserDtoResponse[] = bookings.map((booking) => ({
    id: booking.id,
    hotel_id: booking.room.hotel_id,
    hotel_name: booking.room.hotel.name,
    room_type_name: booking.room.room_type.name,
    room_id: booking.room_id,
    room_name: booking.room.name,
    price: booking.room.room_type.price,
    check_in_date: dayjs(booking.check_in_date).toISOString(),
    check_out_date: dayjs(booking.check_out_date).toISOString(),
    status: booking.status,
  }));

  return NextResponse.json(response);
}
