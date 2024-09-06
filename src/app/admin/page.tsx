"use client";

import { Button, notification, Select } from "antd";
import Card from "@/components/Card";
import { Form, Input } from "antd";
import useSWR from "swr";
import { axiosCustomFetcher, axiosFetcher } from "@/lib/fetcher";
import { useState } from "react";
import { District, Province } from "@/types/vietnamese-location-api/address";
import { FormProps, useForm } from "antd/es/form/Form";
import { UserCreateDto } from "@/types/dto/usersCreate.dto";
import usersService from "@/services/users.service";
import hotelsService from "@/services/hotels.service";
import { HotelsDtoCreate } from "@/types/dto/hotelsCreate.dto";

export default function AdminHome() {
  const [messageApi, contextHolder] = notification.useNotification();
  const [form] = Form.useForm();
  const [selectedProvince, setSelectedProvince] = useState<string>("0");
  const [selectedDistrict, setSelectedDistrict] = useState<string>("0");
  const [selectedWard, setSelectedWard] = useState<string>("0");

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

  const {
    data: provinces,
    error: provinces_error,
    isLoading: provinces_loading,
  } = useSWR("https://vapi.vnappmob.com/api/province/", axiosCustomFetcher);
  const {
    data: districts,
    error: districts_error,
    isLoading: districts_loading,
  } = useSWR(
    `https://vapi.vnappmob.com/api/province/district/${selectedProvince}`,
    axiosCustomFetcher
  );
  const {
    data: wards,
    error: wards_error,
    isLoading: wards_loading,
  } = useSWR(
    `https://vapi.vnappmob.com/api/province/ward/${selectedDistrict}`,
    axiosCustomFetcher
  );

  // if (provinces_error) return <div>error...</div>;
  // if (provinces_loading) return <div>Loading ...</div>;

  const province_options = provinces?.results
    .sort((a: Province, b: Province) =>
      a.province_name.localeCompare(b.province_name)
    )
    .map((province: Province) => ({
      label: province.province_name,
      value: province.province_id,
    }));

  // if (districts_error) return <div>error...</div>;
  // if (districts_loading) return <div>Loading ...</div>;

  const district_options = districts?.results
    .sort((a: District, b: District) =>
      a.district_name.localeCompare(b.district_name)
    )
    .map((district: District) => ({
      label: district.district_name,
      value: district.district_id,
    }));

  const ward_options = districts?.results
    .sort((a: District, b: District) =>
      a.district_name.localeCompare(b.district_name)
    )
    .map((district: District) => ({
      label: district.district_name,
      value: district.district_id,
    }));

  // Handle Province Change
  const handleProvinceChange = (value: any) => {
    setSelectedProvince(value);

    //set lại giá trị District và select
    setSelectedDistrict("0");
    form.setFieldsValue({ district: "0" });

    //set lại giá trị Ward và select
    setSelectedWard("0");
    form.setFieldsValue({ ward: "0" });
  };

  // Handle District Change
  const handleDistrictChange = (value: any) => {
    setSelectedDistrict(value);

    //set lại giá trị Ward và select
    setSelectedWard("0");
    form.setFieldsValue({ ward: "0" });
  };

  // Handle Ward Change
  const handleWardChange = (value: any) => {
    setSelectedWard(value);
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
  const onCreateHotelFinish: FormProps<HotelsDtoCreate>["onFinish"] = async (
    values
  ) => {
    try {
      if (
        values.street != undefined &&
        values.ward != undefined &&
        values.district != undefined &&
        values.province != undefined
      ) {
        await hotelsService.CreateOne(values);
        success("Khách sạn");
      } else {
        error("Khách sạn");
      }
    } catch (err) {
      error("Khách sạn");
    }
  };

  const onCreateHotelFinishFailed: FormProps["onFinishFailed"] = (
    errorInfo
  ) => {
    console.log("Failed:", errorInfo);
  };

  //Handle Create Hotel end

  return (
    <div>
      {contextHolder}
      <Card>
        <div className="space-y-6">
          <div className="flex justify-between items-center px-8">
            <div className="text-2xl font-semibold">Booking</div>
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
                <Form.Item label="Họ và tên" name="fullName">
                  <Input></Input>
                </Form.Item>
                <Form.Item label="Địa chỉ Email" name="email">
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
                    value={selectedWard}
                  >
                    <Select.Option value={"0"}>Chọn Xã/Phường</Select.Option>
                    {ward_options &&
                      ward_options.map((option: any) => (
                        <Select.Option key={option.value} value={option.value}>
                          {option.label}
                        </Select.Option>
                      ))}
                  </Select>
                </Form.Item>
                <Form.Item label="Quận/Huyện" name="district">
                  <Select
                    placeholder="Chọn Quận/Huyện"
                    onChange={handleDistrictChange}
                    value={selectedDistrict}
                  >
                    <Select.Option value={"0"}>Chọn Quận/Huyện</Select.Option>
                    {district_options &&
                      district_options.map((option: any) => (
                        <Select.Option key={option.value} value={option.value}>
                          {option.label}
                        </Select.Option>
                      ))}
                  </Select>
                </Form.Item>
                <Form.Item label="Tỉnh/Thành phố" name="province">
                  <Select
                    placeholder="Chọn Tỉnh/Thành phố"
                    onChange={handleProvinceChange}
                    value={selectedProvince}
                    options={province_options}
                  ></Select>
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
      </Card>
      {selectedProvince + " - " + selectedDistrict + " - " + selectedWard}
    </div>
  );
}
