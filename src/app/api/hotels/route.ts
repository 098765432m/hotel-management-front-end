import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

export async function GET() {
  const prisma = new PrismaClient();
  const hotels = await prisma.hotel.findMany();

  return NextResponse.json(hotels);
}

export async function POST(request: Request) {
  const prisma = new PrismaClient();
  const body = await request.json();

  const result = await prisma.hotel.create({
    data: body,
  });

  return NextResponse.json(result);
}
