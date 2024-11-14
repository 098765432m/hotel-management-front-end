"use client";

import { Hotel } from "@/types/hotel.interface";
import { addressToString } from "@/utils/helpers";
import Image from "next/image";
import Card from "./CardDefault";
import Link from "next/link";
import Button from "./Button";
import { CldImage } from "next-cloudinary";

interface Props {
  hotel: Hotel;
}

export default function HotelCard({ hotel }: Props) {
  const cloudinary_path =
    process.env.NEXT_PUBLIC_CLOUDINARY_URL +
    "/" +
    process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME +
    "/image/upload/v1";

  return (
    <Card>
      <div className="block ">
        <div className="relative ">
          <div className=" overflow-hidden w-[300px] h-[175px]">
            {/* <Image
              priority
              src={
                hotel.images.length > 0
                  ? `${cloudinary_path}/${hotel.img_public_id}.${hotel.img_format}`
                  : `${process.env.NEXT_PUBLIC_CLOUDINARY_DEFAULT_IMAGE}`
              }
              width={300}
              height={200}
              alt={hotel.name}
            ></Image> */}
            {hotel.images.length > 0 ? (
              <CldImage
                priority
                src={`${cloudinary_path}/${hotel.images[0].public_id}.${hotel.images[0].format}`}
                width={300}
                height={200}
                alt={hotel.name}
              ></CldImage>
            ) : (
              <CldImage
                priority
                src={`${process.env.NEXT_PUBLIC_CLOUDINARY_DEFAULT_IMAGE}`}
                width={300}
                height={200}
                alt={hotel.name}
              ></CldImage>
            )}
          </div>
          <div className="flex justify-between absolute bottom-0 left-0 w-full px-6 text-stone-200 text-lg font-bold">
            <div>{hotel.address.province.name}</div>
            {/* <div>{hotel.room_types ? hotel.room_types![0].price : 0}đ</div> */}
          </div>
        </div>
      </div>
      <div className="mt-3 px-4 w-[300px] overflow-hidden ">
        <div className="text-xl text-ellipsis overflow-hidden text-nowrap mb-1">
          {hotel.name}
        </div>
        <div className="text-sm">{addressToString(hotel.address)}</div>
        <div className="flex justify-center mt-4">
          <Link href={`/hotel/${hotel.id}`}>
            <Button>Xem chi tiết</Button>
          </Link>
        </div>
      </div>
    </Card>
  );
}
