import { hashedPassword } from "@/lib/auth";
import { UserCreateDto } from "@/types/dto/usersCreate.dto";

import { prisma } from "@/lib/client";
import { NextResponse } from "next/server";
import ShortUniqueId from "short-unique-id";
import { handleNextApiError } from "@/lib/error-handler/errorHandler";

export async function POST(request: Request) {
  try {
    const uid = new ShortUniqueId({ length: 6 });
    const body: UserCreateDto = await request.json();
    console.log(body);

    //Hashed Password
    body.password = await hashedPassword(body.password!);
    console.log("Hashed password: " + body.password);

    const result = await prisma.user.create({
      data: {
        ...body,
        id: uid.rnd(),
        password: body.password,
      },
    });

    return NextResponse.json(result);
  } catch (error) {
    return handleNextApiError(error);
  }
}
