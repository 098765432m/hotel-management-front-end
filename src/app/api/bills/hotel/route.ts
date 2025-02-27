import { prisma } from "@/lib/client";
import { handleNextApiError } from "@/lib/error-handler/errorHandler";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const body: any = await req.json();
    const bills = await prisma.bill.findMany({
      where: {
        hotel_name: body.hotelName,
        date_billed: body.dateBilled,
      },
      orderBy: {
        room_type_name: "asc",
        date_billed: "asc",
      },
    });
    return NextResponse.json(bills, { status: 200 });
  } catch (error) {
    console.error(error);
    return handleNextApiError(error);
  }
}
