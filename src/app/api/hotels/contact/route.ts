import { hashedPassword } from "@/lib/auth";
import { prisma } from "@/lib/client";
import { HotelContactCreateDto } from "@/types/dto/hotel.dto";
import { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";
import ShortUniqueId from "short-unique-id";

export async function POST(request: Request) {
  const body: HotelContactCreateDto = await request.json();

  console.log(body);

  const result = prisma.$transaction(async (prisma) => {
    const newHotel = await prisma.hotel.create({
      data: {
        name: body.hotelName,
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
        fullName: body.fullName,
        phoneNumber: body.phoneNumber,
        role: "MANAGER",

        hotel_id: newHotel.id,
      },
    });

    return [newHotel, newUser];
  });

  return NextResponse.json({});
}
