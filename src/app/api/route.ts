import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
export async function GET() {
  const prima = new PrismaClient();
  const rooms = await prima.rooms.findMany();
  return NextResponse.json(rooms);
}
