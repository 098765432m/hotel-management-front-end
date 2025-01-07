"use client";

import styles from "@/styles/dashboard/main-page/MainPage.module.scss";
import { Button, Form, Input, Popconfirm, Select } from "antd";
import CardDefault from "../../custom-component/CardDefault";
import useSWR from "swr";
import { axiosCustomFetcher } from "@/lib/fetcher";
import { useEffect, useMemo, useReducer, useState } from "react";
import { CldImage, CldUploadWidget } from "next-cloudinary";
import { UploadedImageDto } from "@/types/dto/image.dto";
import hotelsService from "@/services/hotels.service";
import {
  DispatchType,
  null_address,
} from "@/types/vietnamese-location-api/address";
import { FaEdit, FaRegTrashAlt } from "react-icons/fa";
import { MdAddToPhotos } from "react-icons/md";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";
import imagesService from "@/services/images.service";
import { useSelector } from "react-redux";
import { RootState } from "@/state/store";
import { AddressType } from "@/types/address.interface";
import { reducerAddress } from "@/utils/vietnamese-address/helpers";
import { transformAddressEntity } from "@/utils/helpers";
import MantineButton from "@/components/custom-component/MantineButton";
import { Modal } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useRouter } from "next/navigation";

const initialInfo = { id: "", name: "" };

const initialAddress: AddressType = {
  province: initialInfo,
  district: initialInfo,
  ward: initialInfo,
  street: "",
};

export default function HotelForm() {
  const router = useRouter();
  const [form] = Form.useForm();
  const authStore = useSelector((state: RootState) => state.auth);

  const [isEditFormOpen, { open: openEditForm, close: closeEditForm }] =
    useDisclosure(false);
  const {
    data: hotel,
    isLoading: isHotelLoading,
    error: isHotelError,
    mutate: hotelMutate,
  } = useSWR(`/api/hotels/${authStore.authInfo?.hotelId}`, axiosCustomFetcher); //Get Hotel via Id

  console.log(hotel);

  //State Start

  const [address, addressDispatch] = useReducer(reducerAddress, initialAddress);

  //State End

  //SWR Start

  const {
    data: provinces,
    error: provinces_error,
    isLoading: provinces_loading,
  } = useSWR(
    `${process.env.NEXT_PUBLIC_VN_ADDRESS_URL}/provinces/?size=${process.env.NEXT_PUBLIC_VN_ADDRESS_DEFAULT_SIZE}`,
    axiosCustomFetcher
  );

  const {
    data: districts,
    error: districts_error,
    isLoading: districts_loading,
  } = useSWR(
    `${process.env.NEXT_PUBLIC_VN_ADDRESS_URL}/districts/${
      address.province.id as string
    }/?size=${process.env.NEXT_PUBLIC_VN_ADDRESS_DEFAULT_SIZE}`,
    axiosCustomFetcher
  );

  const {
    data: wards,
    error: wards_error,
    isLoading: wards_loading,
  } = useSWR(
    `${process.env.NEXT_PUBLIC_VN_ADDRESS_URL}/wards/${
      address.district.id as string
    }/?size=${process.env.NEXT_PUBLIC_VN_ADDRESS_DEFAULT_SIZE}`,
    axiosCustomFetcher
  );

  //SWR end

  // Sort province, district, ward Start
  const province_options = useMemo(() => {
    return transformAddressEntity(provinces);
  }, [provinces]);
  const district_options = useMemo(() => {
    return transformAddressEntity(districts);
  }, [districts]);

  const ward_options = useMemo(() => {
    return transformAddressEntity(wards);
  }, [wards]);

  // Sort province, district, ward End

  const handleProvinceChange = (value: any) => {
    const { id, name } = JSON.parse(value);

    addressDispatch({
      type: DispatchType.SET_PROVINCE,
      payload: {
        province: {
          id,
          name,
        },
      },
    });

    //set lại giá trị District và select
    form.setFieldsValue({ district: null_address });

    //set lại giá trị Ward và select
    form.setFieldsValue({ ward: null_address });
  };

  // Handle District Change
  const handleDistrictChange = (value: any) => {
    const { id, name } = JSON.parse(value);
    addressDispatch({
      type: DispatchType.SET_DISTRICT,
      payload: {
        district: {
          id,
          name,
        },
      },
    });

    //set lại giá trị Ward và select
    form.setFieldsValue({ ward: null_address });
  };

  // Handle Ward Change
  const handleWardChange = (value: any) => {
    const { id, name } = JSON.parse(value);
    addressDispatch({
      type: DispatchType.SET_WARD,
      payload: {
        ward: {
          id,
          name,
        },
      },
    });
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
          ward: address.ward,
          district: address.district,
          province: address.province,
        },
      });
      hotelMutate();

      router.refresh(); // Cập nhật lại dữ liệu mới
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
      addressDispatch({
        type: DispatchType.SET_EXISTED,
        payload: {
          street: hotel.address.street,
          ward: hotel.address.ward,
          district: hotel.address.district,
          province: hotel.address.province,
        },
      });
    }
  }, [hotel]);

  if (hotel)
    return (
      <>
        <span className={styles.dashboard_hotel_edit_button}>
          <MantineButton
            size="compact-sm"
            color="yellow"
            onClick={openEditForm}
          >
            <FaEdit></FaEdit>
          </MantineButton>
        </span>
        <Modal
          title="Chỉnh sửa"
          opened={isEditFormOpen}
          onClose={closeEditForm}
        >
          <div className={styles.main_page_form_container}>
            <Form onFinish={handleUpdateFinish} form={form}>
              <div>
                <Form.Item
                  name={"name"}
                  label="Tên khách sạn"
                  initialValue={hotel.name}
                >
                  <Input></Input>
                </Form.Item>
              </div>
              <div>
                <Form.Item
                  label="Đường"
                  name="street"
                  initialValue={
                    hotel && hotel.address ? hotel.address.street : ""
                  }
                  rules={[
                    {
                      required: true,
                      message: "Vị trí đường khách sạn bị trống",
                    },
                  ]}
                >
                  <Input></Input>
                </Form.Item>
              </div>
              <div>
                <Form.Item
                  label="Xã/Phường"
                  name="ward"
                  initialValue={
                    hotel && hotel.address
                      ? JSON.stringify({
                          id: hotel.address.ward.id,
                          name: hotel.address.ward.name,
                        })
                      : JSON.stringify({ id: null, name: null })
                  }
                >
                  <Select
                    placeholder="Chọn Xã/Phường"
                    onChange={handleWardChange}
                    value={JSON.stringify(address.ward)}
                  >
                    <Select.Option
                      value={JSON.stringify({ id: null, name: null })}
                    >
                      Chọn Xã/Phường
                    </Select.Option>
                    {ward_options &&
                      ward_options.map(
                        (option: { name: string; value: string }) => (
                          <Select.Option
                            key={option.value}
                            value={JSON.stringify({
                              id: option.value,
                              name: option.name,
                            })}
                          >
                            {option.name}
                          </Select.Option>
                        )
                      )}
                  </Select>
                </Form.Item>
              </div>
              <div>
                <Form.Item
                  label="Quận/Huyện"
                  name="district"
                  initialValue={
                    hotel && hotel.address
                      ? JSON.stringify({
                          id: hotel.address.district.id,
                          name: hotel.address.district.name,
                        })
                      : JSON.stringify({ id: null, name: null })
                  }
                >
                  <Select
                    placeholder="Chọn Quận/Huyện"
                    onChange={handleDistrictChange}
                    value={JSON.stringify(address.district)}
                  >
                    <Select.Option
                      value={JSON.stringify({ id: null, name: null })}
                    >
                      Chọn Quận/Huyện
                    </Select.Option>
                    {district_options &&
                      district_options.map(
                        (option: { name: string; value: string }) => (
                          <Select.Option
                            key={option.value}
                            value={JSON.stringify({
                              id: option.value,
                              name: option.name,
                            })}
                          >
                            {option.name}
                          </Select.Option>
                        )
                      )}
                  </Select>
                </Form.Item>
              </div>
              <div>
                {" "}
                <Form.Item
                  label="Tỉnh/Thành phố"
                  name="province"
                  initialValue={
                    hotel && hotel.address
                      ? JSON.stringify({
                          id: hotel.address.province.id,
                          name: hotel.address.province.name,
                        })
                      : JSON.stringify({ id: null, name: null })
                  }
                >
                  <Select
                    placeholder="Chọn Tỉnh/Thành phố"
                    onChange={handleProvinceChange}
                    value={JSON.stringify(address.province)}
                  >
                    <Select.Option
                      value={JSON.stringify({ id: null, name: null })}
                    >
                      Chọn Tỉnh/Thành phố
                    </Select.Option>
                    {province_options &&
                      province_options.map((option: any) => (
                        <Select.Option
                          key={option.value}
                          value={JSON.stringify({
                            id: option.value,
                            name: option.name,
                          })}
                        >
                          {option.name}
                        </Select.Option>
                      ))}
                  </Select>
                </Form.Item>
              </div>

              <div className={styles.submit_button}>
                <Form.Item>
                  <Button type="primary" htmlType="submit">
                    <IoMdCheckmarkCircleOutline
                      size={20}
                    ></IoMdCheckmarkCircleOutline>{" "}
                    Lưu
                  </Button>
                </Form.Item>
              </div>
            </Form>
          </div>
        </Modal>
      </>
    );
}
