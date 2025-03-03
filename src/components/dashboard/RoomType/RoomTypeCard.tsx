"use client";

import styles from "@/styles/dashboard/room-type/RoomType.module.scss";
import imagesService from "@/services/images.service";
import roomTypesServices from "@/services/roomTypes.services";
import { RoomType } from "@/types/roomTypes.interface";
import {
  Button as AntdButton,
  Card,
  Form,
  Input,
  InputNumber,
  Modal,
  Popconfirm,
} from "antd";
import { CldImage, CldUploadWidget } from "next-cloudinary";
import { useState } from "react";
import { mutate as mutateGlobal } from "swr";
import { FaRegTrashAlt } from "react-icons/fa";
import { FaEdit } from "react-icons/fa";
import { IoCloudUpload as UploadIcon } from "react-icons/io5";
import { UploadedRoomTypeImage } from "@/types/dto/image.dto";
import CardDefault from "@/components/custom-component/CardDefault";

import { Button } from "@mantine/core";
import { RoomTypeHotelPayload } from "@/types/dto/room-types.dto";

interface Props {
  hotelId: string;
  RoomType: RoomTypeHotelPayload;
}

export default function RoomTypeCard({ hotelId, RoomType }: Props) {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isConfirmRmOpen, setConfirmRmOpen] = useState(false);
  const [name, setName] = useState(RoomType.name);
  const [price, setPrice] = useState<number>(RoomType.price);
  const [uploadedImage, setUploadedImage] = useState<UploadedRoomTypeImage[]>(
    []
  );

  // Handle Update Submit
  const handleOk = async () => {
    // Cap nhat RoomType va cap nhat hinh
    await roomTypesServices.updateOne(RoomType.id, {
      name: name,
      price: price,
      images: uploadedImage,
    });

    mutateGlobal(`/api/roomTypes/hotel/${hotelId}`); // Tại sao mutate không được

    setUploadedImage([]);
  };

  //Handle Remove a Single Image
  const handleRemoveImage = async (imageId: string, public_id: string) => {
    await imagesService.removeOne(imageId, public_id);

    mutateGlobal(`/api/roomTypes/hotel/${hotelId}`); // Tại sao mutate không được
  };

  return (
    <div>
      <CardDefault>
        <div className={styles.room_type_card}>
          <div className={styles.room_type_card_header}>
            <div>{RoomType.name}</div>
            <Button
              color="yellow"
              size="compact-sm"
              onClick={() => setIsEditOpen(true)}
            >
              <FaEdit></FaEdit>
            </Button>
          </div>{" "}
          <span>Giá loại phòng: {RoomType.price}</span>{" "}
        </div>
      </CardDefault>
      <Modal
        title="Chỉnh sửa"
        open={isEditOpen}
        onCancel={() => {
          setIsEditOpen(false);
        }}
        cancelText="Đóng"
        onOk={handleOk}
        okText="Lưu"
      >
        <Form
          labelAlign="left"
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 18 }}
        >
          <Form.Item label="Tên loại phòng" initialValue={name} required>
            <Input
              defaultValue={name}
              onChange={(e) => setName(e.currentTarget.value)}
            ></Input>
          </Form.Item>
          <Form.Item label="Giá loại phòng" initialValue={price} required>
            <InputNumber
              defaultValue={price}
              step={1000}
              min={1000}
              onChange={(value: number | null) => setPrice(value ?? 1000)}
            ></InputNumber>
          </Form.Item>
          <div>
            {/* this button on top-right image */}
            {RoomType.images && RoomType.images.length > 0 ? (
              RoomType.images.map((image, index) => {
                return (
                  <div className="" key={index}>
                    <Popconfirm
                      title="Xac Nhan"
                      description="Ban co muon xoa hinh anh khong"
                      onConfirm={() =>
                        handleRemoveImage(image.id, image.public_id)
                      }
                      onCancel={() => setConfirmRmOpen(false)}
                    >
                      <AntdButton
                        type="primary"
                        danger
                        onClick={() => setConfirmRmOpen(true)}
                        style={{
                          position: "absolute",
                          top: 10,
                          right: 10,
                          zIndex: 1,
                        }}
                      >
                        <FaRegTrashAlt></FaRegTrashAlt>
                      </AntdButton>
                    </Popconfirm>
                    <CldImage
                      key={index}
                      src={`${process.env.NEXT_PUBLIC_CLOUDINARY_PATHNAME}/${image.public_id}.${image.format}`}
                      alt="123"
                      height={200}
                      width={200}
                      priority //LCP
                    ></CldImage>
                  </div>
                );
              })
            ) : (
              <div>
                <CldImage
                  src={
                    process.env.NEXT_PUBLIC_CLOUDINARY_DEFAULT_IMAGE as string
                  }
                  height={200}
                  width={200}
                  alt={"as"}
                  style={{
                    borderWidth: 2,
                    borderColor: "#000",
                    borderRadius: 8,
                  }}
                  priority
                ></CldImage>
              </div>
            )}
          </div>
          <CldUploadWidget
            signatureEndpoint={`/api/sign-cloudinary-params`}
            onSuccess={(result) => {
              if (
                result &&
                result.info != undefined &&
                typeof result.info === "object"
              ) {
                const info = result.info as {
                  public_id: string;
                  format: string;
                };

                setUploadedImage((prev) => [
                  ...prev,
                  {
                    public_id: info.public_id,
                    format: info.format,
                    room_type_id: RoomType.id,
                  },
                ]);
              }
            }}
          >
            {({ open }) => {
              return (
                <Button onClick={() => open()}>
                  <UploadIcon size={25}></UploadIcon>
                </Button>
              );
            }}
          </CldUploadWidget>
        </Form>
      </Modal>
    </div>
  );
}
