import { hashedPassword } from "@/lib/auth";
import { UserCreateDto } from "@/types/dto/usersCreate.dto";

import { prisma } from "@/lib/client";
import { NextResponse } from "next/server";
import ShortUniqueId from "short-unique-id";

export async function POST(request: Request) {
  const uid = new ShortUniqueId({ length: 6 });
  const body: UserCreateDto = await request.json();

  //Hashed Password
  body.password = await hashedPassword(body.password!);
  console.log("Hashed password: " + body.password);

  const result = await prisma.user.create({
    data: {
      ...body,
      id: uid.rnd(),
      // username: body.username,
      password: body.password,
      // fullName: body.fullName,
      // email: body.email,
      // phoneNumber: body.phoneNumber,
      // role: body.role,
      // hotel_id: body.hotel_id,
    },
  });

  console.log(result);

  return NextResponse.json(result);
}
