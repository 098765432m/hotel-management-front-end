import { hashedPassword } from "@/lib/auth";
import { prisma } from "@/lib/client";
import { HotelContactCreateDto } from "@/types/dto/hotel.dto";
import { Prisma } from "@prisma/client";
import { message } from "antd";
import { NextResponse } from "next/server";
import ShortUniqueId from "short-unique-id";

export async function POST(request: Request) {
  try {
    const body: HotelContactCreateDto = await request.json();

    const result = await prisma.$transaction(async (prisma) => {
      const newHotel = await prisma.hotel.create({
        data: {
          name: body.hotel_name,
          address: {
            street: body.street,
            ward: body.ward,
            district: body.district,
            province: body.province,
          },
        },
      });

      const uid = new ShortUniqueId({ length: 6 });

      const newUser = await prisma.user.create({
        data: {
          id: uid.rnd(),
          username: body.email,
          password: await hashedPassword("113446"),
          email: body.email,
          full_name: body.full_name,
          phone_number: body.phone_number,
          role: "MANAGER",

          hotel_id: newHotel.id,
        },
      });

      return [newHotel, newUser];
    });
  } catch (error) {
    console.log(error);

    if (error instanceof Error)
      return NextResponse.json(
        {
          success: false,
          message: "Tên đăng nhập, email, hoặc số điện thoại đã bị trùng",
        },
        { status: 401 }
      );
    return NextResponse.json(
      { success: false, message: "Lỗi hệ thống" },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true }, { status: 201 });
}
