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
import { NumberToMoneyFormat } from "@/utils/helpers";

interface Props {
  hotelId: string;
  RoomType: RoomTypeHotelPayload;
  roomTypeMutate: () => void;
}

export default function RoomTypeCard({
  hotelId,
  RoomType,
  roomTypeMutate,
}: Props) {
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

    setUploadedImage([]);

    roomTypeMutate();
  };

  //Handle Remove a Single Image
  const handleRemoveImage = async (imageId: string, public_id: string) => {
    await imagesService.removeOne(imageId, public_id);

    roomTypeMutate();
  };

  return (
    <div>
      <CardDefault className={styles.room_type_card}>
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
        <span>Giá loại phòng: {NumberToMoneyFormat(RoomType.price)}đ</span>{" "}
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
          className={styles.edit_room_type_form_layout}
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
          <div className={styles.room_type_list_image}>
            {RoomType.images && RoomType.images.length > 0 ? (
              RoomType.images.map((image, index) => {
                return (
                  <div
                    className={styles.room_type_image_group_container}
                    key={index}
                  >
                    <Popconfirm
                      title="Xác nhận"
                      okText="Xóa"
                      cancelText={"Hủy"}
                      description="Bạn có muốn xóa hình ảnh không ?"
                      onConfirm={() =>
                        handleRemoveImage(image.id, image.public_id)
                      }
                      onCancel={() => setConfirmRmOpen(false)}
                    >
                      <AntdButton
                        size="small"
                        type="primary"
                        danger
                        onClick={() => setConfirmRmOpen(true)}
                        className={styles.delete_image_button}
                      >
                        <FaRegTrashAlt size={12}></FaRegTrashAlt>
                      </AntdButton>
                    </Popconfirm>
                    <div className={styles.room_type_image_container}>
                      <CldImage
                        key={index}
                        src={`${process.env.NEXT_PUBLIC_CLOUDINARY_PATHNAME}/${image.public_id}.${image.format}`}
                        alt={"Ảnh loại phòng"}
                        fill
                        priority
                        className={styles.room_type_image}
                      ></CldImage>
                    </div>
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
                  <div className={styles.upload_image_button}>
                    <div className={styles.upload_text}>Upload</div>{" "}
                    <UploadIcon size={20}></UploadIcon>
                  </div>
                </Button>
              );
            }}
          </CldUploadWidget>
        </Form>
      </Modal>
    </div>
  );
}
