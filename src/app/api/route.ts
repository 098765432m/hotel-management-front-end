import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
export async function GET() {
  const prima = new PrismaClient();
  const rooms = await prima.room.findMany();
  return NextResponse.json(rooms);
}
