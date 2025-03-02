"use client";
import styles from "@/styles/dashboard/main-page/MainPage.module.scss";
import CardDefault from "@/components/custom-component/CardDefault";
import { Button, Popconfirm } from "antd";
import { CldImage, CldUploadWidget } from "next-cloudinary";
import { FaRegTrashAlt } from "react-icons/fa";
import { MdAddToPhotos } from "react-icons/md";
import imagesService from "@/services/images.service";
import { useSelector } from "react-redux";
import { RootState } from "@/state/store";
import useSWR from "swr";
import { axiosCustomFetcher } from "@/lib/swr";

export default function UploadedImage() {
  const authStore = useSelector((state: RootState) => state.auth);

  //Fetch Hotel
  const { data: hotel } = useSWR(
    () => `/api/hotels/${authStore.authInfo?.hotelId}`,
    axiosCustomFetcher
  );

  //Handle Remove Image
  const handleRemoveImage = async (imageId: string, public_id: string) => {
    await imagesService.removeOne(imageId, public_id);
  };

  if (hotel)
    return (
      <div className={styles.uploaded_image_container}>
        <CardDefault>
          <div className={styles.uploaded_image_container}>
            <div className={styles.uploaded_image_heading}>Ảnh khách sạn</div>
            <div className={styles.upload_button}>
              <CldUploadWidget
                signatureEndpoint={`/api/sign-cloudinary-params`}
                onSuccess={(result) => {
                  if (result && result.info && typeof result.info == "object") {
                    const info = result.info as {
                      public_id: string;
                      format: string;
                    };

                    imagesService.uploadOne({
                      ...info,
                      hotel_id: authStore.authInfo!.hotelId as string,
                    });
                  }
                }}
              >
                {({ open }) => {
                  return (
                    <Button type="primary" onClick={() => open()}>
                      <MdAddToPhotos size={30}></MdAddToPhotos>
                    </Button>
                  );
                }}
              </CldUploadWidget>
            </div>
            <div className={styles.uploaded_image}>
              {hotel && hotel.images && hotel.images.length > 0 ? (
                hotel.images.map(
                  (
                    image: { id: string; public_id: string; format: string },
                    index: number
                  ) => {
                    return (
                      <div className="relative inline-block" key={index}>
                        <Popconfirm
                          title="Xác nhận"
                          description="Bạn có muốn xóa ảnh không ?"
                          onConfirm={() =>
                            handleRemoveImage(image.id, image.public_id)
                          }
                        >
                          <Button
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
                          width={200}
                          height={200}
                          alt="Hinh khach san"
                          priority
                          style={{
                            border: "solid 1px black",
                          }}
                        ></CldImage>
                      </div>
                    );
                  }
                )
              ) : (
                <CldImage
                  src={`${process.env.NEXT_PUBLIC_CLOUDINARY_DEFAULT_IMAGE}`}
                  width={200}
                  height={200}
                  alt="Hinh khach san"
                  priority
                  style={{
                    border: "solid 1px black",
                    borderRadius: "20px",
                  }}
                ></CldImage>
              )}
            </div>
          </div>
        </CardDefault>
      </div>
    );
}
