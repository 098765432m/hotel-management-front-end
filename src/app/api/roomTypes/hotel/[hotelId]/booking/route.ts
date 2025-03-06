import { prisma } from "@/lib/client";
import { handleNextApiError } from "@/lib/error-handler/errorHandler";
import CustomError from "@/lib/error-handler/errors";
import { DatesRangeValue } from "@mantine/dates";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { hotelId: string } }
) {
  try {
    const filterDateRangeParams =
      request.nextUrl.searchParams.get("filterDateRange"); //Lấy chuỗi query
    const filterDateRange: DatesRangeValue | [null, null] =
      filterDateRangeParams
        ? ((
            JSON.parse(decodeURIComponent(filterDateRangeParams)) as [
              string,
              string
            ]
          ).map((date) => (date ? new Date(date) : null)) as DatesRangeValue)
        : [null, null];

    if (
      !filterDateRange ||
      !Array.isArray(filterDateRange) ||
      filterDateRange.length !== 2
    ) {
      // Throw Lỗi nếu không nhận được ngày đặt phòng
      throw new CustomError.ValidationError("Hãy điền vào ngày đặt phòng!");
    }

    if (!filterDateRange[0] || !filterDateRange[1]) {
      console.error("Check In Date", filterDateRange[0]);
      console.error("Check Out Date", filterDateRange[1]);
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
                    check_in_date: { lt: filterDateRange[0] },
                    check_out_date: { gt: filterDateRange[1] },
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
                    check_in_date: { lt: filterDateRange[0] },
                    check_out_date: { gt: filterDateRange[1] },
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

    return NextResponse.json(roomTypes);
  } catch (error) {
    return handleNextApiError(error);
  }
}
