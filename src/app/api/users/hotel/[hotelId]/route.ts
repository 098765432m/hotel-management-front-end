import { prisma } from "@/lib/client";
import { handleNextApiError } from "@/lib/error-handler/errorHandler";
import { ApiResponseClass } from "@/types/common/api-response";
import { StaffHotelPayload } from "@/types/dto/user.dto";
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

    const [staffs, totalStaff] = await Promise.all([
      prisma.user.findMany({
        where: {
          hotel_id: hotelId,
        },
        include: {
          image: true,
        },
        orderBy: {
          role: "asc",
        },
        skip: pageSkip,
        take: limit,
      }),

      prisma.user.count({
        where: { hotel_id: hotelId },
      }),
    ]);

    return NextResponse.json(
      new ApiResponseClass<{ staffs: StaffHotelPayload[]; totalStaff: number }>(
        { data: { staffs, totalStaff }, success: true }
      ),
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return handleNextApiError(error);
  }
}
