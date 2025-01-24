import { hashedPassword } from "@/lib/auth";
import { prisma } from "@/lib/client";
import { UserUpdateDto } from "@/types/dto/user.dto";
import { v2 as cloudinary } from "cloudinary";
import { NextResponse } from "next/server";

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function GET(
  req: Request,
  { params }: { params: { user_id: string } }
) {
  const user = await prisma.user.findFirst({
    where: {
      id: params.user_id,
    },
    include: {
      image: true,
    },
  });

  return NextResponse.json(user);
}

export async function PUT(
  req: Request,
  { params }: { params: { user_id: string } }
) {
  const { password, ...body }: UserUpdateDto = await req.json();

  const updatedUser = await prisma.user.update({
    where: { id: params.user_id },
    data: {
      ...body,
      ...(password && { password: await hashedPassword(password) }),
    },
  });

  return NextResponse.json(updatedUser);
}

export async function DELETE(
  req: Request,
  { params }: { params: { user_id: string } }
) {
  console.time("DELETE OPERATION");

  try {
    await prisma.$transaction(async (tx) => {
      const deletedImage = await tx.image.delete({
        where: {
          user_id: params.user_id,
        },
      });

      await Promise.all([
        cloudinary.uploader.destroy(deletedImage.public_id),
        tx.user.delete({
          where: {
            id: params.user_id,
          },
        }),
      ]);
    });

    console.timeEnd("DELETE OPERATION");

    return NextResponse.json(
      `Xóa tài khoản với id ${params.user_id} thành công!`
    );
  } catch (error) {
    console.timeEnd("DELETE OPERATION");
    console.error(error);
    return NextResponse.json("Error deleting user", { status: 500 });
  }
}
