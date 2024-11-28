"use client";

import { Hotel } from "@/types/hotel.interface";
import { addressToString } from "@/utils/helpers";
import Image from "next/image";
import CardDefault from "./custom-component/CardDefault";
import Link from "next/link";
import Button from "./Button";
import { CldImage } from "next-cloudinary";
import NextLink from "./custom-component/NextLink";
import MantineButton from "./custom-component/MantineButton";
import NextImage from "./custom-component/NextImage";

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
    <CardDefault>
      <div className=" ">
        <div className=" ">
          <div className=" ">
            {hotel.images.length > 0 ? (
              <NextImage
                priority
                src={`${cloudinary_path}/${hotel.images[0].public_id}.${hotel.images[0].format}`}
                width={300}
                height={200}
                alt={hotel.name}
              ></NextImage>
            ) : (
              <NextImage
                priority
                src={`${process.env.NEXT_PUBLIC_CLOUDINARY_DEFAULT_IMAGE}`}
                width={300}
                height={200}
                alt={hotel.name}
              ></NextImage>
            )}
          </div>
          <div className="">
            <div>{hotel.address.province.name}</div>
            {/* <div>{hotel.room_types ? hotel.room_types![0].price : 0}đ</div> */}
          </div>
        </div>
      </div>
      <div className=" ">
        <div className="">{hotel.name}</div>
        <div className="">{addressToString(hotel.address)}</div>
        <div className="">
          <NextLink href={`/hotel/${hotel.id}`}>
            <MantineButton>Xem chi tiết</MantineButton>
          </NextLink>
        </div>
      </div>
    </CardDefault>
    // <CardDefault>
    //   <div className=" ">
    //     <div className=" ">
    //       <div className=" overflow-hidden w-[300px] h-[175px]">
    //         {hotel.images.length > 0 ? (
    //           <NextImage
    //             priority
    //             src={`${cloudinary_path}/${hotel.images[0].public_id}.${hotel.images[0].format}`}
    //             width={300}
    //             height={200}
    //             alt={hotel.name}
    //           ></NextImage>
    //         ) : (
    //           <NextImage
    //             priority
    //             src={`${process.env.NEXT_PUBLIC_CLOUDINARY_DEFAULT_IMAGE}`}
    //             width={300}
    //             height={200}
    //             alt={hotel.name}
    //           ></NextImage>
    //         )}
    //       </div>
    //       <div className="flex justify-between absolute bottom-0 left-0 w-full px-6 text-stone-200 text-lg font-bold">
    //         <div>{hotel.address.province.name}</div>
    //         {/* <div>{hotel.room_types ? hotel.room_types![0].price : 0}đ</div> */}
    //       </div>
    //     </div>
    //   </div>
    //   <div className="mt-3 px-4 w-[300px] overflow-hidden ">
    //     <div className="text-xl text-ellipsis overflow-hidden text-nowrap mb-1">
    //       {hotel.name}
    //     </div>
    //     <div className="text-sm">{addressToString(hotel.address)}</div>
    //     <div className="flex justify-center mt-4">
    //       <NextLink href={`/hotel/${hotel.id}`}>
    //         <MantineButton>Xem chi tiết</MantineButton>
    //       </NextLink>
    //     </div>
    //   </div>
    // </CardDefault>
  );
}
