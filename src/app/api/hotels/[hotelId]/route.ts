import { prisma } from "@/lib/client";
import { HotelPutDto } from "@/types/dto/hotel.dto";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { hotelId: string } }
) {
  const hotel = await prisma.hotel.findFirst({
    where: {
      id: params.hotelId,
    },
    include: {
      rooms: true,
      room_types: true,
      staffs: true,
      images: true,
    },
  });

  return NextResponse.json(hotel);
}

export async function PUT(
  request: Request,
  { params }: { params: { hotelId: string } }
) {
  const body: HotelPutDto = await request.json();

  console.log(params.hotelId);
  console.log("images");
  console.log(body.images);

  // const [updatedHotel, addedImages] = await prisma.$transaction([
  //   prisma.hotel.update({
  //     where: {
  //       id: params.hotelId,
  //     },
  //     data: {
  //       name: body.name,
  //       address: {
  //         street: body.address.street,
  //         ward: { id: body.address.ward.id, name: body.address.ward.name },
  //         district: {
  //           id: body.address.district.id,
  //           name: body.address.district.name,
  //         },
  //         province: {
  //           id: body.address.province.id,
  //           name: body.address.province.name,
  //         },
  //       },
  //     },
  //   }),

  //   prisma.image.createMany({
  //     data: body.images.map((image) => ({
  //       public_id: image.public_id,
  //       format: image.format,
  //       hotel_id: params.hotelId,
  //     })),
  //   }),
  // ]);

  const newHotel = await prisma.hotel.update({
    where: {
      id: params.hotelId,
    },
    data: {
      name: body.name,
      address: {
        street: body.address.street,
        ward: { id: body.address.ward.id, name: body.address.ward.name },
        district: {
          id: body.address.district.id,
          name: body.address.district.name,
        },
        province: {
          id: body.address.province.id,
          name: body.address.province.name,
        },
      },
    },
  });

  const newImages =
    body.images.length > 0
      ? await prisma.image.createMany({
          data: body.images.map((image) => ({
            public_id: image.public_id,
            format: image.format,
            hotel_id: params.hotelId,
          })),
        })
      : null;

  return NextResponse.json([newHotel, newImages]);
}
