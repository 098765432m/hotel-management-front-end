import { prisma } from "@/lib/client";
import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function DELETE(
  request: Request,
  { params }: { params: { imageId: string } }
) {
  const url = new URL(request.url);
  const publicId = url.searchParams.get("public_id") as string;

  await prisma.$transaction(async (tx) => {
    const result = await tx.image.delete({
      where: { id: params.imageId },
    });

    console.log(result);

    const deletedImage = await cloudinary.uploader.destroy(
      publicId,
      (error: any, result: any) => {
        console.log(result, error);
      }
    );

    console.log(deletedImage);
  });

  return NextResponse.json({});
}
