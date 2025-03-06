import { prisma } from "@/lib/client";
import { handleNextApiError } from "@/lib/error-handler/errorHandler";
import CustomError from "@/lib/error-handler/errors";
import { ApiResponseClass } from "@/types/common/api-response";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const user_fullName = request.nextUrl.searchParams.get("fullName");
    if (user_fullName)
      throw new CustomError.ValidationError(
        "Lỗi không nhận được id người dùng"
      );

    const [bills, totalBill] = await prisma.$transaction([
      prisma.bill.findMany({
        where: {
          guest_name: user_fullName as string,
        },
      }),

      prisma.bill.count({
        where: {
          guest_name: user_fullName as string,
        },
      }),
    ]);

    return NextResponse.json(
      new ApiResponseClass({
        success: true,
        data: {
          bills,
          totalBill,
        },
      }),
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return handleNextApiError(error);
  }
}
