import { prisma } from "@/lib/client";
import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { error } from "console";

interface updateRequest {
  user_id: string;
  old_img_public_id: string;
  img_public_id: string;
  img_format: string;
}

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Upload new avatar on Cloudinary and delete old one
export async function POST(req: Request) {
  const data: updateRequest = await req.json();
  console.log("Update avatar");
  console.log(data);

  try {
    const existingImage = await prisma.image.findUnique({
      where: {
        public_id: data.old_img_public_id ?? "",
      },
    });

    await prisma.$transaction([
      ...(existingImage
        ? [
            prisma.image.delete({
              where: {
                public_id: data.old_img_public_id,
              },
            }),
          ]
        : []),

      prisma.image.create({
        data: {
          public_id: data.img_public_id,
          format: data.img_format,

          user_id: data.user_id,
        },
      }),
    ]);

    if (data.old_img_public_id != undefined) {
      cloudinary.uploader.destroy(data.old_img_public_id, (error, result) => {
        console.log(result, error);
      });
    }

    return NextResponse.json({});
  } catch (error) {
    console.log(error);
  }

  return NextResponse.json({});
}
