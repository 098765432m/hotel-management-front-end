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
      // ...body,
      username: body.username,
      full_name: body.fullName,
      email: body.email,
      phone_number: body.phoneNumber,
      is_active: body.isActive ?? false,
      ...(body.role && { role: body.role }),
      ...(password && { password: await hashedPassword(password) }),
    },
  });

  return NextResponse.json(updatedUser);
}

export async function DELETE(
  req: Request,
  { params }: { params: { user_id: string } }
) {
  try {
    const userId = params.user_id;
    const image = await prisma.image.findUnique({
      where: {
        user_id: userId,
      },
    });

    await prisma.$transaction(async (tx) => {
      if (image) {
        const deletedImage = await tx.image.delete({
          where: {
            user_id: userId,
          },
        });

        await cloudinary.uploader.destroy(deletedImage.public_id);
      }

      await tx.user.delete({
        where: {
          id: userId,
        },
      });
    });

    return NextResponse.json(
      `Xóa tài khoản với id ${params.user_id} thành công!`
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json("Error deleting user", { status: 500 });
  }
}
