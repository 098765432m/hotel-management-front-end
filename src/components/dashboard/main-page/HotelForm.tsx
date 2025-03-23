"use client";

import styles from "@/styles/dashboard/main-page/MainPage.module.scss";
import { Button, Form, Input, message, Select } from "antd";
import useSWR from "swr";
import { axiosCustomFetcher } from "@/lib/swr";
import { useEffect, useMemo, useReducer } from "react";
import hotelsService from "@/services/hotels.service";
import {
  DispatchType,
  null_address,
} from "@/types/vietnamese-location-api/address";
import { FaEdit } from "react-icons/fa";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";
import { useSelector } from "react-redux";
import { RootState } from "@/state/store";
import { AddressType } from "@/types/address.interface";
import { reducerAddress } from "@/utils/vietnamese-address/helpers";
import { transformAddressEntity } from "@/utils/helpers";
import { Modal } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useRouter } from "next/navigation";
import { MdEdit } from "react-icons/md";

const initialInfo = { id: "", name: "" };

const initialAddress: AddressType = {
  province: initialInfo,
  district: initialInfo,
  ward: initialInfo,
  street: "",
};

export default function HotelForm() {
  const [messageApi, contextHolder] = message.useMessage();
  const router = useRouter();
  const [form] = Form.useForm();
  const authStore = useSelector((state: RootState) => state.auth);

  const [isEditFormOpen, { open: openEditForm, close: closeEditForm }] =
    useDisclosure(false);
  const { data: hotel, mutate: hotelMutate } = useSWR(
    () => `/api/hotels/${authStore.authInfo?.hotelId}`,
    axiosCustomFetcher
  ); //Get Hotel via Id

  //State Start

  const [address, addressDispatch] = useReducer(reducerAddress, initialAddress);

  //State End

  //SWR Start

  const { data: provinces } = useSWR(
    () =>
      `${process.env.NEXT_PUBLIC_VN_ADDRESS_URL}/provinces/?size=${process.env.NEXT_PUBLIC_VN_ADDRESS_DEFAULT_SIZE}`,
    axiosCustomFetcher,
    { refreshInterval: 0 }
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
      try {
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
        messageApi.success("Cập nhật thành công");
        closeEditForm();
        router.refresh(); // Cập nhật lại dữ liệu mới
      } catch (error) {
        messageApi.error("Lỗi cập nhật thông tin khách sạn");
        console.error(error);
      }
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
        {contextHolder}
        <span className={styles.dashboard_hotel_edit_button}>
          {/* <MantineButton
            size="compact-sm"
            color="yellow"
            onClick={openEditForm}
          >
            <MdEdit></MdEdit>
          </MantineButton> */}
          <Button type="primary" onClick={openEditForm}>
            <MdEdit></MdEdit>
          </Button>
        </span>
        <Modal
          title="Chỉnh sửa"
          opened={isEditFormOpen}
          onClose={closeEditForm}
        >
          <Form
            className={styles.main_page_form_container}
            onFinish={handleUpdateFinish}
            form={form}
            labelAlign="left"
            labelCol={{ span: 10 }}
            wrapperCol={{ span: 14 }}
          >
            <div>
              <Form.Item
                name={"name"}
                label="Tên khách sạn"
                initialValue={hotel.name}
                required
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
                required
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
                required
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
                required
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
        </Modal>
      </>
    );
}
