"use client";

import imagesService from "@/services/images.service";
import roomTypesServices from "@/services/roomTypes.services";
import { RoomType } from "@/types/roomTypes.interface";
import {
  Button,
  Card,
  Form,
  Input,
  InputNumber,
  Modal,
  Popconfirm,
} from "antd";
import { CldImage, CldUploadWidget } from "next-cloudinary";
import { useState } from "react";
import { FaRegTrashAlt } from "react-icons/fa";
import { FaEdit } from "react-icons/fa";
import { UploadedRoomTypeImage } from "@/types/dto/image.dto";

interface Props {
  RoomType: RoomType;
  mutate: any;
}

export default function RoomTypeCard({ RoomType, mutate }: Props) {
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

    mutate();
    console.log(typeof mutate());

    setUploadedImage([]);
  };

  //Handle Remove a Single Image
  const handleRemoveImage = async (imageId: string, public_id: string) => {
    const result = await imagesService.removeOne(imageId, public_id);

    mutate();

    console.log(result);
  };

  return (
    <Card>
      <div className="flex justify-around">
        <span>Tên loại phòng: {RoomType.name}</span>{" "}
        <span>Giá loại phòng: {RoomType.price}</span>{" "}
        <button onClick={() => setIsEditOpen(true)}>
          <FaEdit></FaEdit>
        </button>
      </div>

      <div>
        {/* this button on top-right image */}
        {RoomType.images && RoomType.images.length > 0 ? (
          RoomType.images.map((image, index) => {
            return (
              <div className="relative inline-block" key={index}>
                <Popconfirm
                  title="Xac Nhan"
                  description="Ban co muon xoa hinh anh khong"
                  onConfirm={() => handleRemoveImage(image.id, image.public_id)}
                  onCancel={() => setConfirmRmOpen(false)}
                >
                  <Button
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
                  </Button>
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
          <CldImage
            src={process.env.NEXT_PUBLIC_CLOUDINARY_DEFAULT_IMAGE as string}
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
        )}
      </div>
      <Modal
        title="Chinh sua loai phong"
        open={isEditOpen}
        onCancel={() => {
          setIsEditOpen(false);
        }}
        onOk={handleOk}
      >
        <Form>
          <Form.Item label="Tên loại phòng" initialValue={name}>
            <Input
              defaultValue={name}
              onChange={(e) => setName(e.currentTarget.value)}
            ></Input>
          </Form.Item>
          <Form.Item label="Giá loại phòng" initialValue={price}>
            <InputNumber
              defaultValue={price}
              step={1000}
              min={1000}
              onChange={(value: number | null) => setPrice(value ?? 1000)}
            ></InputNumber>
          </Form.Item>
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
              return <Button onClick={() => open()}>Upload hình ảnh</Button>;
            }}
          </CldUploadWidget>
        </Form>
      </Modal>
    </Card>
  );
}
