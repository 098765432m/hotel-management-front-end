import { prisma } from "@/lib/client";
import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { Result } from "postcss";

export default async function DELETE(
  request: Request,
  { params }: { params: { imageId: string } }
) {
  const body = await request.json();

  const [deletedImage, destroyImage] = await prisma.$transaction([
    await prisma.image.delete({
      where: { id: params.imageId },
    }),

    await cloudinary.uploader.destroy(
      body.public_id,
      (error: any, result: any) => {
        console.log(result, error);
      }
    ),
  ]);

  return NextResponse.json({
    deletedImage: deletedImage,
    destroyImage: destroyImage,
  });
}
