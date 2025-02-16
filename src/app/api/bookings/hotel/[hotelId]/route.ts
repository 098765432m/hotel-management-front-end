import { prisma } from "@/lib/client";
import { handleNextApiError } from "@/lib/error-handler/errorHandler";
import CustomError from "@/lib/error-handler/errors";
import dayjs from "dayjs";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { hotelId: string } }
) {
  try {
    const dateQuery = request.nextUrl.searchParams.get("date");

    if (!dateQuery) {
      // Throw Lỗi nếu không nhận được ngày đặt phòng
      throw new CustomError.ValidationError("Thiếu ngày tra cứu!");
    }

    const filterDate = new Date(dateQuery);

    if (!filterDate) {
      throw new CustomError.InternalServerError(
        "Lỗi hệ thống! Format ngày bị lỗi"
      );
    }
    const bookings = await prisma.booking.findMany({
      where: {
        room: {
          hotel_id: params.hotelId,
        },
        check_in_date: filterDate,
      },
      include: {
        user: {
          select: {
            full_name: true,
          },
        },
        room: {
          select: {
            name: true,
            hotel_id: true,
            room_type: {
              select: {
                name: true,
                price: true,
              },
            },
          },
        },
      },
    });

    console.log("bookings", bookings);

    return NextResponse.json(bookings);
  } catch (error) {
    console.error(error);

    return handleNextApiError(error);
  }
}
