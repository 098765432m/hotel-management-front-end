import { verifyPassword } from "@/lib/auth";
import { createSession } from "@/lib/session";
import { prisma } from "@/lib/client";
import { NextResponse } from "next/server";
import { UserCookieResponse } from "@/types/dto/user.dto";

interface loginForm {
  username: string;
  password: string;
}

export async function POST(request: Request) {
  const body: loginForm = await request.json();

  // Find user with username
  const user = await prisma.user.findUnique({
    where: {
      username: body.username,
    },
  });

  // Check if password is valid
  const result =
    user != undefined && (await verifyPassword(body.password, user.password));

  console.log("result: " + result);

  //Create jwt session
  if (result) {
    await createSession({
      userId: user.id,
      role: user.role,
      hotelId: user.hotel_id,
    });
  }

  const userResponse: UserCookieResponse | null =
    user != undefined
      ? {
          id: user.id as string,
          username: user?.username as string,
          role: user?.role as string,
          hotelId: user?.hotel_id ?? undefined,
        }
      : null;

  console.log(userResponse);

  return NextResponse.json(userResponse);
}
