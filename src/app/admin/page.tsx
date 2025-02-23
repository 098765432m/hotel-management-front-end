"use client";

import { Button, notification, Select } from "antd";
import CardDefault from "@/components/custom-component/CardDefault";
import { Form, Input } from "antd";
import useSWR from "swr";
import { axiosCustomFetcher, axiosFetcher } from "@/lib/fetcher";
import { useEffect, useMemo, useReducer, useState } from "react";
import {
  ActionAddress,
  DispatchType,
  District,
  initialAddress,
  null_address,
  Province,
} from "@/types/vietnamese-location-api/address";
import { FormProps, useForm } from "antd/es/form/Form";
import { UserCreateDto } from "@/types/dto/usersCreate.dto";
import usersService from "@/services/users.service";
import hotelsService from "@/services/hotels.service";
import { HotelsDtoCreate } from "@/types/dto/hotelsCreate.dto";
import { HotelFormCreateProps } from "@/types/dto/hotel.dto";
import { transformAddressEntity } from "@/utils/helpers";
import { AddressType } from "@/types/address.interface";
import { reducerAddress } from "@/utils/vietnamese-address/helpers";
import { boolean } from "zod";

export default function AdminHome() {
  const [messageApi, contextHolder] = notification.useNotification();
  const [form] = Form.useForm();
  const [address, addressDispatch] = useReducer(reducerAddress, initialAddress);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  //Antd
  const success = (str: string) => {
    messageApi.success({
      message: "Thao tác thành công!",
      description: `${str} thành công`,
    });
  };

  const error = (str: string) => {
    messageApi.error({
      message: `Lỗi ${str} xảy ra`,
      description: "Lỗi",
    });
  };
  //Antd end

  const { data: provinces } = useSWR(
    `${process.env.NEXT_PUBLIC_VN_ADDRESS_URL}/provinces/?size=${process.env.NEXT_PUBLIC_VN_ADDRESS_DEFAULT_SIZE}`,
    axiosCustomFetcher,
    {
      refreshInterval: 0,
    }
  );

  const { data: districts } = useSWR(
    () =>
      `${process.env.NEXT_PUBLIC_VN_ADDRESS_URL}/districts/${
        address.province.id as string
      }/?size=${process.env.NEXT_PUBLIC_VN_ADDRESS_DEFAULT_SIZE}`,
    axiosCustomFetcher
  );

  const { data: wards } = useSWR(
    () =>
      `${process.env.NEXT_PUBLIC_VN_ADDRESS_URL}/wards/${
        address.district.id as string
      }/?size=${process.env.NEXT_PUBLIC_VN_ADDRESS_DEFAULT_SIZE}`,
    axiosCustomFetcher
  );

  const province_options = useMemo(() => {
    return transformAddressEntity(provinces);
  }, [provinces]);

  const district_options = useMemo(() => {
    return transformAddressEntity(districts);
  }, [districts]);

  const ward_options = useMemo(() => {
    return transformAddressEntity(wards);
  }, [wards]);

  // Handle Province Change
  const handleProvinceChange = (value: any) => {
    const [name, id] = JSON.parse(value);

    addressDispatch({
      type: DispatchType.SET_PROVINCE,
      payload: {
        province: {
          name: name,
          id: id,
        },
      },
    });

    // set lại giá trị District và select
    form.setFieldsValue({ district: null_address });

    //set lại giá trị Ward và select
    form.setFieldsValue({ ward: null_address });
  };

  // Handle District Change
  const handleDistrictChange = (value: any) => {
    const [name, id] = JSON.parse(value);
    addressDispatch({
      type: DispatchType.SET_DISTRICT,
      payload: {
        district: {
          name: name,
          id: id,
        },
      },
    });

    //set lại giá trị Ward và select
    form.setFieldsValue({ ward: null_address });
  };

  // Handle Ward Change
  const handleWardChange = (value: any) => {
    const [name, id] = JSON.parse(value);
    addressDispatch({
      type: DispatchType.SET_WARD,
      payload: { ward: { name: name, id: id } },
    });
  };

  // Handle Create User
  const onCreateUserFinish: FormProps<UserCreateDto>["onFinish"] = async (
    values
  ) => {
    try {
      await usersService.CreateOne(values);
      success("Đăng ký");
    } catch (err) {
      error("Đăng ký");
    }
  };

  const onCreateUserFinishFailed: FormProps["onFinishFailed"] = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  // Handle Create User end

  //Handle Create Hotel
  const onCreateHotelFinish: FormProps<HotelFormCreateProps>["onFinish"] =
    async (values) => {
      try {
        if (
          values.street != undefined &&
          values.ward != undefined &&
          values.district != undefined &&
          values.province != undefined
        ) {
          await hotelsService.CreateOne({
            name: values.name,
            address: {
              street: values.street,
              ward: address.ward,
              district: address.district,
              province: address.province,
            },
          });
          success("Khách sạn");
        } else {
          error("Khách sạn");
        }
      } catch (err) {
        console.log(err);
      }
    };

  const onCreateHotelFinishFailed: FormProps["onFinishFailed"] = (
    errorInfo
  ) => {
    console.log("Failed:", errorInfo);
  };

  //Handle Create Hotel end

  useEffect(() => {
    setIsLoading(false);
  }, []);

  if (isLoading) return <>Loading ...</>;

  return (
    <div>
      {contextHolder}
      <CardDefault>
        <div className="space-y-6">
          <div className="flex justify-between items-center px-8">
            <div className="text-2xl font-semibold">Quản trị</div>
          </div>
          <div className="flex">
            <div className="w-1/2">
              <Form
                name="user"
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 16 }}
                style={{ maxWidth: 600 }}
                onFinish={onCreateUserFinish}
                onFinishFailed={onCreateUserFinishFailed}
              >
                <Form.Item label="Tên tài khoản" name="username">
                  <Input></Input>
                </Form.Item>
                <Form.Item label="Mật khẩu" name="password">
                  <Input type="password"></Input>
                </Form.Item>
                <Form.Item label="Họ và tên" name="full_name">
                  <Input></Input>
                </Form.Item>
                <Form.Item label="Địa chỉ Email" name="email">
                  <Input></Input>
                </Form.Item>
                <Form.Item label="So dien thoai" name="phone_number">
                  <Input></Input>
                </Form.Item>
                <Form.Item label="Vai trò" name="role" initialValue={"GUEST"}>
                  <Select
                    options={[
                      {
                        label: "Khách hàng",
                        value: "GUEST",
                      },
                      {
                        label: "Nhân viên",
                        value: "STAFF",
                      },
                      {
                        label: "Quản trị",
                        value: "ADMIN",
                      },
                    ]}
                  ></Select>
                </Form.Item>
                <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                  <Button type="primary" htmlType="submit">
                    Tạo tài khoản
                  </Button>
                </Form.Item>
              </Form>
            </div>
            <div className="w-1/2">
              <Form
                name="hotel"
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 16 }}
                style={{ maxWidth: 600 }}
                form={form}
                onFinish={onCreateHotelFinish}
                onFinishFailed={onCreateHotelFinishFailed}
              >
                <Form.Item
                  label="Tên"
                  name="name"
                  rules={[
                    {
                      required: true,
                      message: "Tên khách sạn bị trống",
                    },
                  ]}
                >
                  <Input></Input>
                </Form.Item>
                <Form.Item
                  label="Đường"
                  name="street"
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
                          return Promise.reject(
                            new Error("Vui lòng chọn Xã/Phường")
                          );
                        }
                      },
                    }),
                  ]}
                >
                  <Select
                    placeholder="Chọn Xã/Phường"
                    onChange={handleWardChange}
                    value={address.ward}
                  >
                    <Select.Option value={"0"}>Chọn Xã/Phường</Select.Option>
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
                <Form.Item label="Quận/Huyện" name="district">
                  <Select
                    placeholder="Chọn Quận/Huyện"
                    onChange={handleDistrictChange}
                    value={address.district}
                  >
                    <Select.Option value={"0"}>Chọn Quận/Huyện</Select.Option>
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
                <Form.Item label="Tỉnh/Thành phố" name="province">
                  <Select
                    placeholder="Chọn Tỉnh/Thành phố"
                    onChange={handleProvinceChange}
                    value={address.province}
                  >
                    <Select.Option value={["0", "0"]}>
                      Chọn Tỉnh/Thành phố
                    </Select.Option>
                    {province_options &&
                      province_options.map((option: any) => (
                        <Select.Option
                          key={option.value}
                          value={
                            JSON.stringify([option.name, option.value])
                            // option.value
                          }
                        >
                          {option.name}
                        </Select.Option>
                      ))}
                  </Select>
                </Form.Item>
                <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                  <Button type="primary" htmlType="submit">
                    Tạo Khách sạn
                  </Button>
                </Form.Item>
              </Form>
            </div>
          </div>
        </div>
      </CardDefault>
    </div>
  );
}
