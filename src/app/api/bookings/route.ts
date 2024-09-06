import { Booking } from "@/types/booking.interface";
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

export async function GET() {
  const prisma = new PrismaClient();
  const bookings = await prisma.booking.findMany({
    include: {
      room: true,
      user: true,
    },
  });
  return NextResponse.json(bookings);
}

export async function POST(request: Request) {
  try {
    const prisma = new PrismaClient();
    const data: Booking = await request.json();
    let additionalField: any = {};

    if (data.user_id != undefined) {
      additionalField.user_id = data.user_id;
    } else if (data.fullName != undefined && data.phoneNumber != undefined) {
      additionalField.fullName = data.fullName;
      additionalField.phoneNumber = data.phoneNumber;
    } else {
      throw new Error("Lỗi thiếu thông tin người dùng");
    }

    const modi_data = {
      ...data,
      ...additionalField,
      check_in_date: new Date(data.check_in_date),
      check_out_date: new Date(data.check_out_date),
    };

    const result = await prisma.booking.create({
      data: modi_data,
    });

    return NextResponse.json(result);
  } catch (error) {
    console.log(error);
    throw new Error();
  }
}
