import { verifyPassword } from "@/lib/auth";
import { createSession } from "@/lib/session";
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

interface loginForm {
  username: string;
  password: string;
}

export async function POST(request: Request) {
  const prisma = new PrismaClient();
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

  //Create jwt session
  if (result) {
    await createSession(user.id);
  }
  return NextResponse.json(result);
}
