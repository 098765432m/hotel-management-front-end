import { NextResponse } from "next/server";

export async function PATCH(
  request: Request,
  { params }: { params: { bookingId: string } }
) {
  return NextResponse.json(params.bookingId);
}
