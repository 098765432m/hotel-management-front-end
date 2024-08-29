import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

export async function GET() {
  const prisma = new PrismaClient();
  const bookings = await prisma.bookings.findMany();
  return NextResponse.json(bookings);
}

export async function POST(request: Request) {
  const prisma = new PrismaClient();
  const data = await request.json();
  const modi_data = {
    ...data,
    check_in_date: new Date(data.check_in_date),
    check_out_date: new Date(data.check_out_date),
  };

  const result = await prisma.bookings.create({
    data: modi_data,
  });

  return NextResponse.json(result);
}
