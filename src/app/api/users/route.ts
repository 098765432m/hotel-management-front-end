import { NextResponse } from "next/server";
import { prisma } from "@/lib/client";
export async function GET() {
  const users = await prisma.user.findMany({
    include: {
      hotel: true,
      booking: true,
    },
  });

  return NextResponse.json(users);
}
