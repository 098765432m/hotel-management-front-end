import { prisma } from "@/lib/client";
import { handleNextApiError } from "@/lib/error-handler/errorHandler";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { hotelId: string } }
) {
  try {
    const hotelId = params.hotelId;
    const pageQuery = req.nextUrl.searchParams.get("page");
    console.log("pageQuery", pageQuery);

    const limitQuery = req.nextUrl.searchParams.get("limit");
    const pageIndex = pageQuery ? Number(pageQuery) : undefined; // Vị trí số trang hiện tại

    //Tính kích cỡ số lượng 1 trang
    const limit = limitQuery ? Number(limitQuery) : undefined;

    console.log(hotelId, pageIndex);
    //Tính số phần tử bỏ qua
    const pageSkip = limit && pageIndex ? pageIndex * limit : undefined;

    console.log("pageSize", limit);

    console.log("pageSkip", pageSkip);

    const [rooms, total] = await prisma.$transaction([
      //Trả về phòng theo pagination
      prisma.room.findMany({
        where: {
          hotel_id: hotelId,
        },
        include: {
          room_type: true,
          bookings: true,
          current_booking: true,
        },
        orderBy: {
          name: "asc",
        },
        skip: pageSkip,
        take: limit,
      }),

      // Trả về tổng số phòng của khách sạn
      prisma.room.count({
        where: {
          hotel_id: hotelId,
        },
      }),
    ]);

    return NextResponse.json(
      {
        success: true,
        data: {
          rooms: rooms,
          totalRoom: total,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return handleNextApiError(error);
  }
}
