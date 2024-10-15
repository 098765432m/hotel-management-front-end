import { prisma } from "@/lib/client";
import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { error } from "console";

interface updateRequest {
  id: string;
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
    const updatedUser = await prisma.user.update({
      where: {
        id: data.id,
      },
      data: {
        img_public_id: data.img_public_id,
        img_format: data.img_format,
      },
    });

    console.log("Updated User");
    console.log(updatedUser);

    await cloudinary.uploader.destroy(
      data.old_img_public_id,
      (error, result) => {
        console.log(result, error);
      }
    );

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.log(error);
  }

  return NextResponse.json({});
}
