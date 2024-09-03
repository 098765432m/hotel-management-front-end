import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

export async function GET() {
  const prisma = new PrismaClient();
  const users = await prisma.user.findMany();

  return NextResponse.json(users);
}

export async function POST(request: Request) {
  const prisma = new PrismaClient();
  const body = await request.json();

  const result = await prisma.user.create({
    data: body,
  });

  return NextResponse.json(result);
}
