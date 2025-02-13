import { verifyPassword } from "@/lib/auth";
import { createSession } from "@/lib/session";
import { prisma } from "@/lib/client";
import { NextResponse } from "next/server";
import { UserCookieResponse } from "@/types/dto/user.dto";
import { handleNextApiError } from "@/lib/error-handler/errorHandler";
import { ValidationError } from "@/lib/error-handler/errors";

interface loginForm {
  username: string;
  password: string;
}

export async function POST(request: Request) {
  try {
    const body: loginForm = await request.json();

    // Find user with username
    const user = await prisma.user.findUnique({
      where: {
        username: body.username,
      },
    });

    if (user == null) {
      throw new ValidationError("Tài khoản đăng nhập không tồn tại!");
    }

    // Check if password is valid
    const result =
      user != undefined && (await verifyPassword(body.password, user.password));

    //Create jwt session
    if (result) {
      await createSession({
        id: user.id,
        username: user.username,
        role: user.role,
        hotelId: user.hotel_id,
      });
    } else {
      throw new ValidationError("Mật khẩu không hợp lệ!");
    }

    const userResponse: UserCookieResponse | null = result
      ? {
          id: user.id as string,
          username: user?.username as string,
          role: user?.role as string,
          hotelId: user?.hotel_id ?? null,
        }
      : null;

    return NextResponse.json(userResponse);
  } catch (error) {
    console.error(error);
    return handleNextApiError(error);
  }
}
