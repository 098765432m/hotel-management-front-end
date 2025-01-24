import { prisma } from "@/lib/client";
import { UploadedImageDto } from "@/types/dto/image.dto";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body: UploadedImageDto = await request.json();
  console.log(body);

  const image = await prisma.image.create({
    data: {
      public_id: body.public_id,
      format: body.format,
      hotel_id: body.hotel_id,
      room_type_id: body.room_type_id,
      user_id: body.user_id,
    },
  });

  return NextResponse.json(image);
}
