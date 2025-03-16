import { prisma } from "@/lib/client";
import { RoomType } from "@/types/roomTypes.interface";
import { NextResponse } from "next/server";

export async function PUT(
  request: Request,
  { params }: { params: { roomTypeId: string } }
) {
  const body: RoomType = await request.json();

  const [updatedRoomType, images] = await prisma.$transaction([
    prisma.roomType.update({
      where: { id: params.roomTypeId },
      data: {
        name: body.name,
        price: body.price,
      },
    }),

    prisma.image.createMany({
      data: body.images.map((image) => ({
        public_id: image.public_id,
        format: image.format,
        room_type_id: params.roomTypeId,
      })),
    }),
  ]);

  return NextResponse.json({
    updatedRoomType: updatedRoomType,
    images: images,
  });
}
