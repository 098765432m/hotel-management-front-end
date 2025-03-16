import { prisma } from "@/lib/client";
import { handleNextApiError } from "@/lib/error-handler/errorHandler";
import CustomError from "@/lib/error-handler/errors";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { NextRequest, NextResponse } from "next/server";

// Dashboard xác nhận nhận phòng và cập nhận trạng thái phòng
export async function PATCH(
  request: NextRequest,
  {
    params,
  }: {
    params: { bookingId: string };
  }
) {
  try {
    const query = request.nextUrl.searchParams; // roomId
    const roomId = query.get("roomId");
    if (!roomId) {
      throw new CustomError.ValidationError("Chưa chọn phòng!");
    }

    const [booking, room] = await Promise.all([
      prisma.booking.findUnique({
        where: {
          id: params.bookingId,
        },
      }),

      prisma.room.findUnique({
        where: {
          id: roomId,
        },
      }),
    ]);

    if (!booking) {
      throw new CustomError.NotFoundError("Không tìm thấy đặt phòng!");
    }

    if (!room) {
      throw new CustomError.NotFoundError("Không tìm thấy đặt phòng!");
    }

    if (room.status_room !== "AVAILABLE") {
      throw new CustomError.ValidationError("Phòng đã được sử dụng!");
    }

    if (booking.status !== "BOOKED") {
      throw new CustomError.ValidationError("Đặt phòng không hợp lệ!");
    }

    await prisma.$transaction([
      prisma.booking.update({
        where: {
          id: params.bookingId,
          status: "BOOKED",
        },
        data: {
          status: "CHECK_IN",
        },
      }),

      prisma.room.update({
        where: {
          id: roomId,
          status_room: "AVAILABLE",
        },
        data: {
          status_room: "OCCUPIED",
          current_booking: {
            connect: {
              id: params.bookingId,
            },
          },
        },
      }),
    ]);

    return NextResponse.json(
      { message: "Nhận phòng thành công!" },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
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
