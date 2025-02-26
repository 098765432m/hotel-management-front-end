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
    orderBy: {
      role: "asc",
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
      password: await hashedPassword(data.password ?? "113446"),
    },
  });

  return NextResponse.json(user);
}
