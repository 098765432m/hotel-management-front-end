import { prisma } from "@/lib/client";
import { handleNextApiError } from "@/lib/error-handler/errorHandler";
import CustomError from "@/lib/error-handler/errors";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { hotelId: string } }
) {
  try {
    const dateRange = request.nextUrl.searchParams.get("dateRange"); //Lấy chuỗi query

    if (!dateRange) {
      // Throw Lỗi nếu không nhận được ngày đặt phòng
      throw new CustomError.ValidationError("Hãy điền vào ngày đặt phòng!");
    }

    // Tách chuỗi lấy giá trị ngày đặt phòng
    const [checkInDate, checkOutDate] = dateRange
      .split(",")
      .map((date) => new Date(date));

    console.log(checkInDate, checkOutDate);

    if (!checkInDate || !checkOutDate) {
      console.error("Check In Date", checkInDate);
      console.error("Check Out Date", checkOutDate);
      throw new CustomError.InternalServerError("Format ngày không hợp lệ");
    }

    // TÌm kiếm và trả về
    // LOẠI PHÒNG có PHÒNG status là AVAILABLE
    // và không trùng lập với thời gian đặt phòng
    const roomTypes = await prisma.roomType.findMany({
      where: {
        hotel_id: params.hotelId,
        rooms: {
          some: {
            bookings: {
              none: {
                OR: [
                  {
                    check_in_date: { lt: checkOutDate },
                    check_out_date: { gt: checkInDate },
                  },
                ],
              },
            },
          },
        },
      },
      include: {
        rooms: {
          where: {
            bookings: {
              none: {
                OR: [
                  {
                    check_in_date: { lt: checkOutDate },
                    check_out_date: { gt: checkInDate },
                  },
                ],
              },
            },
          },
        },
      },
      orderBy: {
        name: "asc",
      },
    });

    console.log(roomTypes);

    console.log(
      "booking room",
      roomTypes.map((roomType) => roomType.rooms)
    );

    // console.log(
    //   "booking",
    //   roomTypes.map((roomType) => roomType.rooms)
    // );

    return NextResponse.json(roomTypes);
  } catch (error) {
    return handleNextApiError(error);
  }
}
