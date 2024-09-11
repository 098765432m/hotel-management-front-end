import { hashedPassword } from "@/lib/auth";
import { UserCreateDto } from "@/types/dto/usersCreate.dto";
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import ShortUniqueId from "short-unique-id";

export async function POST(request: Request) {
  const uid = new ShortUniqueId({ length: 6 });
  const prisma = new PrismaClient();
  const body: UserCreateDto = await request.json();

  //Hashed Password
  body.password = await hashedPassword(body.password);

  const result = await prisma.user.create({
    data: {
      id: uid.rnd(),
      ...body,
    },
  });

  return NextResponse.json(result);
}
