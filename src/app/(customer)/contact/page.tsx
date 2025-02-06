"use client";

import styles from "@/styles/customer/contact/ContactPage.module.scss";
import { Select, TextInput, Button, Textarea } from "@mantine/core";
import useSWR from "swr";
import { axiosCustomFetcher } from "@/lib/fetcher";
import { useMemo, useReducer } from "react";
import { AddressType } from "@/types/address.interface";
import { DispatchType } from "@/types/vietnamese-location-api/address";
import { reducerAddress } from "@/utils/vietnamese-address/helpers";
import { transformAddressEntity } from "@/utils/helpers";
import { useForm } from "@mantine/form";
import hotelsService from "@/services/hotels.service";
import { HotelContactCreateDto } from "@/types/dto/hotel.dto";
import CardDefault from "@/components/custom-component/CardDefault";
import MantineButton from "@/components/custom-component/MantineButton";

const initialInfo = { id: "", name: "" };

const initialAddress: AddressType = {
  province: initialInfo,
  district: initialInfo,
  ward: initialInfo,
  street: "",
};

export default function ContactPage() {
  const [address, addressDispatch] = useReducer(reducerAddress, initialAddress);
  const form = useForm<{
    hotelName: string;
    fullName: string;
    email: string;
    phoneNumber: string;
    street: string;
    ward: string | null;
    district: string | null;
    province: string | null;
    note?: string;
  }>({
    mode: "uncontrolled",
    initialValues: {
      hotelName: "",
      fullName: "",
      email: "",
      phoneNumber: "",
      street: "",
      ward: "",
      district: null,
      province: null,
    },
    validate: {
      hotelName: (value) =>
        value.length <= 0 ? "Tên khách sạn không thể trống" : null,
      fullName: (value) =>
        value.length <= 0 ? "Tên khách sạn không thể trống" : null,
      email: (value) =>
        value.length <= 0 ? "Tên khách sạn không thể trống" : null,
      phoneNumber: (value) =>
        value.length <= 0 ? "Tên khách sạn không thể trống" : null,
    },
  });

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

  const province_options = useMemo(() => {
    return transformAddressEntity(provinces);
  }, [provinces]);
  const district_options = useMemo(() => {
    return transformAddressEntity(districts);
  }, [districts]);

  const ward_options = useMemo(() => {
    return transformAddressEntity(wards);
  }, [wards]);

  const handleWardChange = (value: string | null) => {
    const { id, name } = JSON.parse(value as string);

    addressDispatch({
      type: DispatchType.SET_WARD,
      payload: {
        ward: {
          id,
          name,
        },
      },
    });

    form.setValues({
      ward: value,
    });
  };
  const handleDistrictChange = (value: string | null) => {
    const { id, name } = JSON.parse(value as string);
    addressDispatch({
      type: DispatchType.SET_DISTRICT,
      payload: {
        district: {
          id: id,
          name: name,
        },
      },
    });

    form.setValues({
      district: value,
      ward: null,
    });
  };
  const handleProvinceChange = (value: string | null) => {
    if (value != null) {
      const { id, name } = JSON.parse(value as string);

      addressDispatch({
        type: DispatchType.SET_PROVINCE,
        payload: {
          province: {
            id,
            name,
          },
        },
      });
    }

    form.setValues({
      province: value,
      district: null,
      ward: null,
    });
  };

  const handleSubmit = () => {
    const body: HotelContactCreateDto = {
      // ...form.getValues(),
      hotel_name: form.getValues().hotelName,
      full_name: form.getValues().fullName,
      phone_number: form.getValues().phoneNumber,
      email: form.getValues().email,
      note: form.getValues().note,
      street: form.getValues().street,

      ward: JSON.parse(form.getValues().ward as string),
      district: JSON.parse(form.getValues().district as string),
      province: JSON.parse(form.getValues().province as string),
    };

    console.log(body);

    hotelsService.createContact(body);
  };
  return (
    <CardDefault>
      <div className={styles.contact_form_container}>
        <div className={styles.contact_form_heading}>
          <span>Liên hệ hợp tác</span>
        </div>
        <form
          onSubmit={form.onSubmit(handleSubmit)}
          className={styles.contact_form}
        >
          <div className={styles.contact_form_grid}>
            <TextInput
              label="Tên khách sạn"
              placeholder="Khách sạn"
              key={form.key("hotelName")}
              {...form.getInputProps("hotelName")}
            ></TextInput>
            <TextInput
              label="Họ và tên"
              placeholder="Tên đầy đủ"
              key={form.key("fullName")}
              {...form.getInputProps("fullName")}
            ></TextInput>
            <TextInput
              label="Email liên hệ"
              placeholder="Email"
              key={form.key("email")}
              {...form.getInputProps("email")}
            ></TextInput>
            <TextInput
              label="Số điện thoại"
              placeholder="Số điện thoại"
              key={form.key("phoneNumber")}
              {...form.getInputProps("phoneNumber")}
            ></TextInput>
            <TextInput
              label="Đường"
              placeholder="Đường"
              key={form.key("street")}
              {...form.getInputProps("street")}
            ></TextInput>{" "}
            <Select
              label="Phường/Xã"
              placeholder="Chọn Phường/Xã"
              searchable
              onChange={handleWardChange}
              nothingFoundMessage="Nothing found..."
              value={JSON.stringify(address.ward)}
              key={form.key("ward")}
              data={ward_options?.map(
                (option: { name: string; value: string }) => ({
                  label: option.name,
                  value: JSON.stringify({
                    id: option.value,
                    name: option.name,
                  }),
                })
              )}
            />
            <Select
              label="Quận/Huyện"
              placeholder="Chọn Quận/Huyện"
              searchable
              onChange={handleDistrictChange}
              nothingFoundMessage="Nothing found..."
              value={JSON.stringify(address.district)}
              key={form.key("district")}
              data={district_options?.map(
                (option: { name: string; value: string }) => ({
                  label: option.name,
                  value: JSON.stringify({
                    id: option.value,
                    name: option.name,
                  }),
                })
              )}
            />
            <Select
              label="Tinh/Thành phố"
              placeholder="Chọn tỉnh/thành phố"
              searchable
              onChange={handleProvinceChange}
              data={province_options?.map(
                (option: { name: string; value: string }) => ({
                  label: option.name,
                  value: JSON.stringify({
                    id: option.value,
                    name: option.name,
                  }),
                })
              )}
            />
          </div>
          <Textarea
            label="Lời nhắn"
            placeholder="Gửi lời nhắn..."
            resize="vertical"
            autosize
            minRows={3}
            maxRows={8}
            key={form.key("note")}
            {...form.getInputProps("note")}
          ></Textarea>
          <div className={styles.contact_form_action_button}>
            <MantineButton type="submit">Gửi</MantineButton>
          </div>
        </form>
      </div>
    </CardDefault>
  );
}
