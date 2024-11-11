"use client";

import { RoomType } from "@/types/roomTypes.interface";
import { Button, Card, Form, Input, InputNumber, Modal } from "antd";
import FormItem from "antd/es/form/FormItem";
import axios from "axios";
import { CldImage, CldUploadWidget } from "next-cloudinary";
import { useState } from "react";
import { FaRegTrashAlt } from "react-icons/fa";
import { FaEdit } from "react-icons/fa";

interface UploadedImage {
  publicId: string;
  format: string;
}

interface Props {
  RoomType: RoomType;
}

export default function RoomTypeCard({ RoomType }: Props) {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [name, setName] = useState(RoomType.name);
  const [price, setPrice] = useState<number>(RoomType.price);
  const [uploadedImage, setUploadedImage] = useState<UploadedImage[]>([]);

  const handleOk = async () => {
    console.log("ok");
    console.log(name);
    console.log(price);
    console.log(uploadedImage);

    // Cap nhat RoomType va cap nhat hinh
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

      <div className="relative inline-block">
        <Button
          type="primary"
          danger
          style={{
            position: "absolute",
            top: 10,
            right: 10,
            zIndex: 1,
          }}
        >
          <FaRegTrashAlt></FaRegTrashAlt>
        </Button>{" "}
        {/* this button on top-right image */}
        {RoomType.images && RoomType.images.length > 0 ? (
          RoomType.images.map((image, index) => {
            return (
              <CldImage
                key={index}
                src={`${process.env.NEXT_PUBLIC_CLOUDINARY_PATHNAME}/${image.public_id}.${image.format}`}
                alt="123"
                height={200}
                width={200}
                priority //LCP
              ></CldImage>
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
              console.log("on sucess");
              console.log(result);
              console.log(result.info);

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
                    publicId: info.public_id,
                    format: info.format,
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
