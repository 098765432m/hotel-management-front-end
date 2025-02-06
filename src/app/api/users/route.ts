import { NextResponse } from "next/server";
import { prisma } from "@/lib/client";
import { UserCreateDto } from "@/types/dto/usersCreate.dto";
import ShortUniqueId from "short-unique-id";
import { hashedPassword } from "@/lib/auth";

export async function GET() {
  const users = await prisma.user.findMany({
    include: {
      hotel: true,
      booking: true,
    },
  });

  return NextResponse.json(users);
}

// Create User
export async function POST(req: Request) {
  const data: UserCreateDto = await req.json();

  const uid = new ShortUniqueId({ length: 6 });

  const user = await prisma.user.create({
    data: {
      ...data,
      id: uid.rnd(),
      // username: data.username,
      password: await hashedPassword(data.password ?? "113446"),
      // full_name: data.full_name,
      // email: data.email,
      // phone_number: data.phone_number,
      // role: data.role,
      // hotel_id: data.hotel_id,
    },
  });

  return NextResponse.json(user);
}
