import { prisma } from "@/lib/client";
import { handleNextApiError } from "@/lib/error-handler/errorHandler";
import CustomError from "@/lib/error-handler/errors";
import { BookingsDashboardDtoCreate } from "@/types/dto/booking.dto";
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

    console.log("datequery", "filterDate", dateQuery, filterDate);

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
                id: true,
                name: true,
                price: true,
              },
            },
          },
        },
      },
      orderBy: [{ status: "asc" }, { room: { name: "asc" } }],
    });
    return NextResponse.json(bookings);
  } catch (error) {
    console.error(error);

    return handleNextApiError(error);
  }
}

//Dashboard Tạo 1 Booking
export async function POST(
  request: Request,
  { params }: { params: { hotelId: string } }
) {
  try {
    const body: BookingsDashboardDtoCreate = await request.json();

    console.log("body", body);

    const createdBooking = await prisma.booking.create({
      data: {
        check_in_date: body.checkInDate,
        check_out_date: body.checkOutDate,
        status: body.status,
        room: {
          connect: {
            id: body.roomId,
          },
        },
        full_name: body.fullName,
        phone_number: body.phoneNumber,
        ...(body.userId && {
          user: {
            connect: {
              id: body.userId,
            },
          },
        }),
      },
    });
    return NextResponse.json(createdBooking, { status: 201 });
  } catch (error) {
    console.error(error);
    return handleNextApiError(error);
  }
}
