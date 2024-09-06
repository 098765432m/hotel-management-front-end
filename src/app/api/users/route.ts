import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import ShortUniqueId from "short-unique-id";

export async function GET() {
  const prisma = new PrismaClient();
  const users = await prisma.user.findMany({
    include: {
      hotel: true,
      booking: true,
    },
  });

  return NextResponse.json(users);
}

export async function POST(request: Request) {
  const uid = new ShortUniqueId({ length: 6 });
  const prisma = new PrismaClient();
  const body = await request.json();

  const result = await prisma.user.create({
    data: {
      id: uid.rnd(),
      ...body,
    },
  });

  return NextResponse.json(result);
}
