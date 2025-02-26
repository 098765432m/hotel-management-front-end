import { prisma } from "@/lib/client";
import { handleNextApiError } from "@/lib/error-handler/errorHandler";
import CustomError from "@/lib/error-handler/errors";
import { BookingsDashboardDtoUpdate } from "@/types/dto/booking.dto";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
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

// Dashboard cập nhật thông tin đặt phòng
export async function PATCH(
  request: NextRequest,
  { params }: { params: { bookingId: string } }
) {
  try {
    const body: BookingsDashboardDtoUpdate = await request.json();

    await prisma.booking.update({
      where: {
        id: params.bookingId,
      },
      data: {
        check_in_date: body.checkInDate,
        check_out_date: body.checkOutDate,
        room: {
          connect: {
            id: body.roomId,
          },
        },
      },
    });

    return NextResponse.json(
      { success: true, message: "Cập nhật thành công!" },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    if (error instanceof PrismaClientKnownRequestError) {
      // Handle P2025 Not Found Error
      if (error.code === "P2025") {
        return handleNextApiError(
          new CustomError.NotFoundError("Phòng hoặc Đặt phòng không hợp lệ!")
        );
      }
    }

    return handleNextApiError(error);
  }
}

//Dashboard Xáo 1 Booking và cập nhật lại status_room
export async function DELETE(
  request: NextRequest,
  { params }: { params: { bookingId: string } }
) {
  try {
    const query = request.nextUrl.searchParams; // roomId
    const roomId = query.get("roomId");

    const booking = await prisma.booking.findUnique({
      where: {
        id: params.bookingId,
      },
    });

    if (!booking)
      throw new CustomError.NotFoundError("Không tìm thấy đặt phòng!");

    if (booking?.status === "CHECK_IN") {
      await prisma.room.update({
        where: { id: roomId as string, status_room: "OCCUPIED" },
        data: {
          status_room: "AVAILABLE",
          current_booking: {
            disconnect: true,
          },
        },
      });
    }

    await prisma.booking.delete({
      where: {
        id: booking.id,
      },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.log(error);
    if (error instanceof PrismaClientKnownRequestError) {
      // Handle P2025 Not Found Error
      if (error.code === "P2025") {
        return handleNextApiError(
          new CustomError.NotFoundError("Phòng hoặc Đặt phòng không hợp lệ!")
        );
      }
    }
    return handleNextApiError(error);
  }
}
