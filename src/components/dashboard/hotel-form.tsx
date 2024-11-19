"use client";

import { Button, Form, Input, Popconfirm, Select } from "antd";
import CardDefault from "../CardDefault";
import useSWR from "swr";
import { axiosCustomFetcher } from "@/lib/fetcher";
import { useContext, useEffect, useMemo, useState } from "react";
// import { AuthContext } from "@/context/AuthContext";
import { CldImage, CldUploadWidget } from "next-cloudinary";
import { UploadedHotelImage, UploadedImageDto } from "@/types/dto/image.dto";
import hotelsService from "@/services/hotels.service";
import { District, Province } from "@/types/vietnamese-location-api/address";
import { FaRegTrashAlt } from "react-icons/fa";
import imagesService from "@/services/images.service";
import { useSelector } from "react-redux";
import { RootState } from "@/state/store";

//type of address
interface info {
  name: string;
  id: string;
}

const null_address = {
  name: "0",
  id: "0",
};

export default function HotelForm() {
  const [form] = Form.useForm();
  // const { auth } = useContext(AuthContext); // Get auth info of user
  const authStore = useSelector((state: RootState) => state.auth);

  const {
    data: hotel,
    isLoading: isHotelLoading,
    error: isHotelError,
    mutate: hotelMutate,
  } = useSWR(`/api/hotels/${authStore.authInfo?.hotelId}`, axiosCustomFetcher); //Get Hotel via Id

  //State Start
  const [isConfirmRmOpen, setConfirmRmOpen] = useState<boolean>(false);

  const [uploadedHotelImages, setUploadedHotelImages] = useState<
    UploadedImageDto[]
  >([]); //Get info of uploaded images

  const [selectedProvince, setSelectedProvince] = useState<info>(null_address); // Province
  const [selectedDistrict, setSelectedDistrict] = useState<info>(null_address); // District
  const [selectedWard, setSelectedWard] = useState<info>(null_address); // Ward

  //State End

  //SWR Start

  const {
    data: provinces,
    error: provinces_error,
    isLoading: provinces_loading,
  } = useSWR(
    `${process.env.NEXT_PUBLIC_VN_ADDRESS_URL}/api/province/`,
    axiosCustomFetcher
  ); //Get list Provinces

  const {
    data: districts,
    error: districts_error,
    isLoading: districts_loading,
  } = useSWR(
    `${process.env.NEXT_PUBLIC_VN_ADDRESS_URL}/api/province/district/${selectedProvince.id}`, //Get list Districts
    axiosCustomFetcher
  );

  const {
    data: wards,
    error: wards_error,
    isLoading: wards_loading,
  } = useSWR(
    `${process.env.NEXT_PUBLIC_VN_ADDRESS_URL}/api/province/ward/${selectedDistrict.id}`, //Get list Wards
    axiosCustomFetcher
  );

  //SWR end

  // Sort province, district, ward Start
  const province_options = useMemo(() => {
    return provinces?.results
      .sort((a: Province, b: Province) =>
        a.province_name.localeCompare(b.province_name)
      )
      .map((province: Province) => ({
        name: province.province_name,
        value: province.province_id,
      }));
  }, [provinces]);

  const district_options = useMemo(() => {
    return districts?.results
      .sort((a: District, b: District) =>
        a.district_name.localeCompare(b.district_name)
      )
      .map((district: District) => ({
        name: district.district_name,
        value: district.district_id,
      }));
  }, [districts]);

  const ward_options = useMemo(() => {
    return districts?.results
      .sort((a: District, b: District) =>
        a.district_name.localeCompare(b.district_name)
      )
      .map((district: District) => ({
        name: district.district_name,
        value: district.district_id,
      }));
  }, [wards]);

  // Sort province, district, ward End

  const handleProvinceChange = (value: any) => {
    const [name, id] = JSON.parse(value);

    setSelectedProvince({
      name: name,
      id: id,
    });

    //set lại giá trị District và select
    setSelectedDistrict(null_address);
    form.setFieldsValue({ district: null_address });

    //set lại giá trị Ward và select
    setSelectedWard(null_address);
    form.setFieldsValue({ ward: null_address });
  };

  // Handle District Change
  const handleDistrictChange = (value: any) => {
    const [name, id] = JSON.parse(value);
    setSelectedDistrict({
      name: name,
      id: id,
    });

    //set lại giá trị Ward và select
    setSelectedWard(null_address);
    form.setFieldsValue({ ward: null_address });
  };

  // Handle Ward Change
  const handleWardChange = (value: any) => {
    const [name, id] = JSON.parse(value);
    setSelectedWard({
      name: name,
      id: id,
    });
  };

  //Handle Remove Image
  const handleRemoveImage = async (imageId: string, public_id: string) => {
    await imagesService.removeOne(imageId, public_id);

    hotelMutate();
  };

  //Handle Update Submit
  const handleUpdateFinish = async (values: any) => {
    if (
      values.street != undefined &&
      values.ward != undefined &&
      values.district != undefined &&
      values.province != undefined
    ) {
      await hotelsService.updateOne(authStore.authInfo?.hotelId as string, {
        name: values.name,
        address: {
          street: values.street,
          ward: selectedWard,
          district: selectedDistrict,
          province: selectedProvince,
        },
        images: uploadedHotelImages.map((uploadedImage) => ({
          public_id: uploadedImage.public_id,
          format: uploadedImage.format,
        })),
      });

      hotelMutate();
    }
  };

  //useEffect
  /*
      Vì hotel được fetch swr bất đồng bộ nên giá trị ban đâu của hotel là undefined
      Khi hotel được fetch xong rồi liền cập nhật giá trị state ngay lập tức để tiếp tục fetch
    tỉnh, quận, huyện.
  */
  useEffect(() => {
    //Bỏ qua nếu chưa fetch xong giá trị hotel
    if (hotel && hotel.address) {
      setSelectedWard(hotel.address.ward);
      setSelectedDistrict(hotel.address.district);
      setSelectedProvince(hotel.address.province);
    }
  }, [hotel]);

  if (isHotelLoading || wards_loading || districts_loading || provinces_loading)
    return <>Loading ...</>;

  return (
    <CardDefault>
      <Form onFinish={handleUpdateFinish} form={form}>
        <Form.Item
          name={"name"}
          label="Ten khach san"
          initialValue={hotel.name}
        >
          <Input></Input>
        </Form.Item>
        <Form.Item
          label="Đường"
          name="street"
          initialValue={hotel && hotel.address ? hotel.address.street : ""}
          rules={[
            {
              required: true,
              message: "Vị trí đường khách sạn bị trống",
            },
          ]}
        >
          <Input></Input>
        </Form.Item>
        <Form.Item
          label="Xã/Phường"
          name="ward"
          initialValue={
            hotel && hotel.address
              ? JSON.stringify([hotel.address.ward.name, hotel.address.ward.id])
              : ["0", "0"]
          }
          rules={[
            {
              required: true,
              message: "Vui lòng chọn Xã/Phường",
            },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (value != "0") {
                  return Promise.resolve();
                } else {
                  return Promise.reject(new Error("Vui lòng chọn Xã/Phường"));
                }
              },
            }),
          ]}
        >
          <Select
            placeholder="Chọn Xã/Phường"
            onChange={handleWardChange}
            value={selectedWard}
          >
            <Select.Option value={["0", "0"]}>Chọn Xã/Phường</Select.Option>
            {ward_options &&
              ward_options.map((option: any) => (
                <Select.Option
                  key={option.value}
                  value={JSON.stringify([option.name, option.value])}
                >
                  {option.name}
                </Select.Option>
              ))}
          </Select>
        </Form.Item>
        <Form.Item
          label="Quận/Huyện"
          name="district"
          initialValue={
            hotel && hotel.address
              ? JSON.stringify([
                  hotel.address.district.name,
                  hotel.address.district.id,
                ])
              : ["0", "0"]
          }
        >
          <Select
            placeholder="Chọn Quận/Huyện"
            onChange={handleDistrictChange}
            value={selectedDistrict}
          >
            <Select.Option value={["0", "0"]}>Chọn Quận/Huyện</Select.Option>
            {district_options &&
              district_options.map((option: any) => (
                <Select.Option
                  key={option.value}
                  value={JSON.stringify([option.name, option.value])}
                >
                  {option.name}
                </Select.Option>
              ))}
          </Select>
        </Form.Item>
        <Form.Item
          label="Tỉnh/Thành phố"
          name="province"
          initialValue={
            hotel && hotel.address
              ? JSON.stringify([
                  hotel.address.province.name,
                  hotel.address.province.id,
                ])
              : ["0", "0"]
          }
        >
          <Select
            placeholder="Chọn Tỉnh/Thành phố"
            onChange={handleProvinceChange}
            value={selectedProvince}
          >
            <Select.Option value={["0", "0"]}>
              Chọn Tỉnh/Thành phố
            </Select.Option>
            {province_options &&
              province_options.map((option: any) => (
                <Select.Option
                  key={option.value}
                  value={JSON.stringify([option.name, option.value])}
                >
                  {option.name}
                </Select.Option>
              ))}
          </Select>
        </Form.Item>
        <div className="flex justify-around">
          {hotel.images && hotel.images.length > 0 ? (
            hotel.images.map(
              (
                image: { id: string; public_id: string; format: string },
                index: number
              ) => {
                return (
                  <div className="relative inline-block" key={index}>
                    <Popconfirm
                      title="Xac nhan"
                      description="Ban co muon xoa hinh anh khong"
                      onConfirm={() =>
                        handleRemoveImage(image.id, image.public_id)
                      }
                      onCancel={() => setConfirmRmOpen(false)}
                    >
                      <Button
                        onClick={() => setConfirmRmOpen(true)}
                        type="primary"
                        danger
                        style={{
                          position: "absolute",
                          top: 10,
                          right: 10,
                          zIndex: 1,
                        }}
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
                        borderRadius: "20px",
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
        <div>
          <CldUploadWidget
            signatureEndpoint={`/api/sign-cloudinary-params`}
            onSuccess={(result) => {
              if (result && result.info && typeof result.info == "object") {
                const info = result.info as {
                  public_id: string;
                  format: string;
                };

                setUploadedHotelImages((prevState) => [
                  ...prevState,
                  {
                    public_id: info.public_id,
                    format: info.format,
                  },
                ]);
              }
            }}
          >
            {({ open }) => {
              return (
                <Button type="primary" onClick={() => open()}>
                  Upload
                </Button>
              );
            }}
          </CldUploadWidget>
        </div>
        <div className="flex justify-center">
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Luu
            </Button>
          </Form.Item>
        </div>
      </Form>
    </CardDefault>
  );
}
