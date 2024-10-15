import { prisma } from "@/lib/client";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { user_id: string } }
) {
  const user = await prisma.user.findFirst({
    where: {
      id: params.user_id,
    },
  });

  return NextResponse.json(user);
}
