import CardDefault from "@/components/CardDefault";
import roomsServices from "@/services/rooms.services";
import { Room } from "@/types/room.interface";
import { Button, Input, Rating } from "@mui/material";
// import { Collapse, Divider, Input, Rate } from "antd";


import TextArea from "antd/es/input/TextArea";
import Image from "next/image";
import { useEffect, useState } from "react";
import { AiOutlineDownCircle } from "react-icons/ai";
import { AiOutlineRightCircle } from "react-icons/ai";

export default async function RoomDetail({
  params,
}: {
  params: { room_id: string };
}) {

  const cloudinary_path = process.env.NEXT_PUBLIC_CLOUDINARY_URL + '/' + process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME + '/image/upload/v1';
  const room: Room = await roomsServices.getOneById(params.room_id);
  if (room == undefined) return <div></div>;
  return (
    <div className="border-white border-2 rounded-xl">
      <div className="flex justify-center space-x-2">
        <div className="w-[65%] space-y-4">
          {/* Card thông tin phòng*/}
          <CardDefault>
            <div className="flex space-x-4">
              <span className="flex-grow">
                <Image
                  src={room.room_type.img_public_id != null ? `${cloudinary_path}/${room.room_type.img_public_id}` : `${process.env.NEXT_PUBLIC_CLOUDINARY_DEFAULT_IMAGE}`}
                  width={400}
                  height={300}
                  alt={room.name}
                ></Image>
              </span>
              <span className="space-y-4 w-[50%]">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-2xl">{room.name}</span>
                  <span>
                    {/* <Rate defaultValue={5} disabled></Rate> */}
                    <Rating defaultValue={5} readOnly></Rating>
                  </span>
                </div>
                <div className="text-center px-4 py-4 bg-slate-300 rounded-xl">
                  {room.description != undefined ? (
                    <p>{room.description}</p>
                  ) : (
                    <p>
                      Trang chưa có miêu tảTrang chưa có miêu tảTrang chưa có
                      miêu tảTrang chưa có miêu tảTrang chưa có miêu tảTrang
                      chưa có miêu tảTrang chưa có miêu tảTrang chưa có miêu
                      tảTrang chưa có miêu tả
                    </p>
                  )}
                </div>
              </span>
            </div>
          </CardDefault>
          {/* Card Input thông tin khách hàng */}
          <CardDefault>
            <div className="space-y-5">
              <div>
                <div className="font-bold text-xl">Thông tin khách hàng</div>
                <div className="text-xs text-gray-500">
                  <i>
                    Tên khách hàng phải phù hợp với giấy tờ tùy thân để nhận
                    phòng.
                  </i>
                </div>
              </div>
              <div className="w-full space-y-4">
                <div className="flex space-x-2">
                  <span className="w-1/2 space-y-1">
                    <div>
                      <Input placeholder="Họ"></Input>
                    </div>
                  </span>
                  <span className="w-1/2 space-y-1">
                    <Input placeholder="Tên"></Input>
                  </span>
                </div>
                <div className="flex space-x-2">
                  <span className="w-1/2 space-y-1">
                    <Input placeholder="Email"></Input>
                  </span>
                  <span className="w-1/2 space-y-1">
                    <Input placeholder="Số điện thoại"></Input>
                  </span>
                </div>
                <div className="flex justify-center space-x-2">
                  <Button variant="contained">Booking</Button>
                </div>
              </div>
            </div>
          </CardDefault>

          {/* Card yêu cầu đặt biệt */}
          {/* <Collapse
            size="large"
            expandIconPosition="end"
            expandIcon={({ isActive }) => (
              <div className="flex items-center h-full">
                {isActive ? (
                  <AiOutlineDownCircle size={24}></AiOutlineDownCircle>
                ) : (
                  <AiOutlineRightCircle size={24}></AiOutlineRightCircle>
                )}
              </div>
            )}
            items={[
              {
                key: 1,
                label: (
                  <div>
                    <span className="font-bold text-xl space-x-2">
                      <span>Yêu cầu đặc biệt</span>
                      <span className="text-gray-500 text-xs">
                        <i>(Không bắt buộc)</i>
                      </span>
                    </span>
                  </div>
                ),
                children: (
                  <div className="space-y-1">
                    <div className="w-full">
                      <TextArea placeholder="Nhập yêu cầu tại đây"></TextArea>
                    </div>
                  </div>
                ),
              },
            ]}
          ></Collapse> */}
        </div>

        {/* Card giá phòng */}
        <div className="flex-grow">
          <CardDefault>
            <div className="space-y-2">
              <div className="space-y-1">
                <div className="font-bold text-xl">Giá chi tiết</div>
                <div className="grid pt-1">
                  <div className="flex justify-between">
                    <span>1 phòng x 2 đêm</span>
                    <span>200.000đ</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Thuế & phí</span>
                    <span>10.000đ</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Giảm giá</span>
                    <span>20.000đ</span>
                  </div>
                </div>
              </div>
              <hr />
              <div>
                <div className="flex justify-between">
                  <span>Thanh toán trực tiếp</span>
                  <span>6.520.000đ</span>
                </div>
              </div>
            </div>
          </CardDefault>
        </div>
      </div>
    </div>
  );
}
