import { Booking } from "@/types/booking.interface";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/client";
import { BookingsDtoCreate } from "@/types/dto/booking.dto";

export async function GET() {
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
    const data: BookingsDtoCreate = await request.json();
    console.log(data);

    //Check if it has id or fullName, phoneNumber, email
    if (data.user_id != undefined) {
      data.user_id = data.user_id;
    } else if (data.fullName != undefined && data.phoneNumber != undefined) {
      data.fullName = data.fullName;
      data.phoneNumber = data.phoneNumber;
      data.email = data.email;
    } else {
      throw new Error("Lỗi thiếu thông tin người dùng");
    }

    //Luu y check thoi gian truoc khi booking

    const result = await prisma.booking.create({
      data: data,
    });

    return NextResponse.json(result);
  } catch (error) {
    console.log(error);
    throw new Error();
  }
}
