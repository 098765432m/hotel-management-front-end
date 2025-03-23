"use client";
import styles from "@/styles/dashboard/main-page/MainPage.module.scss";
import CardDefault from "@/components/custom-component/CardDefault";
import { Button, message, Popconfirm } from "antd";
import { CldImage, CldUploadWidget } from "next-cloudinary";
import { FaRegTrashAlt } from "react-icons/fa";
import { MdAddToPhotos } from "react-icons/md";
import imagesService from "@/services/images.service";
import { useSelector } from "react-redux";
import { RootState } from "@/state/store";
import useSWR from "swr";
import { axiosCustomFetcher } from "@/lib/swr";
import EmptyData from "@/components/custom-component/EmptyData";

export default function UploadedImage() {
  const authStore = useSelector((state: RootState) => state.auth);

  //Display Message
  const [messageApi, contextHolder] = message.useMessage();

  //Fetch Hotel
  const { data: hotel, mutate: hotelMutate } = useSWR(
    () => `/api/hotels/${authStore.authInfo?.hotelId}`,
    axiosCustomFetcher
  );

  //Handle Remove Image
  const handleRemoveImage = async (imageId: string, public_id: string) => {
    await imagesService.removeOne(imageId, public_id);

    hotelMutate();
    messageApi.success("Xóa ảnh thành công");
  };

  if (hotel)
    return (
      <>
        {contextHolder}
        <div className={styles.uploaded_image_container}>
          <div className={styles.uploaded_image_container}>
            <div className={styles.uploaded_image_heading}>Ảnh khách sạn</div>

            <CldUploadWidget
              signatureEndpoint={`/api/sign-cloudinary-params`}
              onSuccess={async (result) => {
                if (result && result.info && typeof result.info == "object") {
                  try {
                    const info = result.info as {
                      public_id: string;
                      format: string;
                    };

                    await imagesService.uploadOne({
                      ...info,
                      hotel_id: authStore.authInfo!.hotelId as string,
                    });

                    hotelMutate();
                    messageApi.success("Upload ảnh thành công");
                  } catch (error) {
                    console.error(error);
                    messageApi.error("Upload ảnh thất bại");
                  }
                }
              }}
            >
              {({ open }) => {
                return (
                  <Button
                    className={styles.upload_button}
                    type="primary"
                    onClick={() => open()}
                  >
                    <MdAddToPhotos size={20}></MdAddToPhotos>
                    Upload ảnh
                  </Button>
                );
              }}
            </CldUploadWidget>

            {hotel && hotel.images && hotel.images.length > 0 ? (
              <div className={styles.uploaded_image}>
                {hotel.images.map(
                  (
                    image: { id: string; public_id: string; format: string },
                    index: number
                  ) => {
                    return (
                      <div
                        className={styles.uploaded_image_container}
                        key={image ? hotel.id : index}
                      >
                        <Popconfirm
                          title="Xác nhận"
                          description="Bạn có muốn xóa ảnh không ?"
                          onConfirm={() =>
                            handleRemoveImage(image.id, image.public_id)
                          }
                          cancelText="Hủy"
                          okText="Xóa"
                        >
                          <Button
                            size="small"
                            type="primary"
                            danger
                            className={styles.delete_button}
                          >
                            <FaRegTrashAlt color="white"></FaRegTrashAlt>
                          </Button>
                        </Popconfirm>
                        <CldImage
                          src={
                            image.public_id
                              ? `${process.env.NEXT_PUBLIC_CLOUDINARY_PATHNAME}/${image.public_id}.${image.format}`
                              : `${process.env.NEXT_PUBLIC_CLOUDINARY_DEFAULT_IMAGE}`
                          }
                          fill
                          alt={hotel.id}
                          priority
                        ></CldImage>
                      </div>
                    );
                  }
                )}
              </div>
            ) : (
              <CardDefault className={styles.empty_display}>
                <EmptyData></EmptyData>
              </CardDefault>
            )}
          </div>
        </div>
      </>
    );
}
