import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

export async function GET() {
  const prisma = new PrismaClient();
  const rooms = await prisma.rooms.findMany();
  return NextResponse.json(rooms);
}
