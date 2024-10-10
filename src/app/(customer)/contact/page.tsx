"use client";

import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { TextareaAutosize } from "@mui/base";
import useSWR from "swr";
import { axiosCustomFetcher } from "@/lib/fetcher";
import { useReducer } from "react";
import { AddressType } from "@/types/address.interface";
import {
  District,
  Province,
  Ward,
} from "@/types/vietnamese-location-api/address";
import { createContact } from "@/action/user.action";

enum addressDispatchType {
  SET_PROVINCE = "SET_PROVINCE",
  SET_DISTRICT = "SET_DISTRICT",
  SET_WARD = "SET_WARD",
  SET_STREET = "SET_STREET",
}

function reducer(state: AddressType, action: { type: string; payload: any }) {
  switch (action.type) {
    case "SET_PROVINCE":
      return { ...state, province: action.payload };
    case "SET_DISTRICT":
      return { ...state, district: action.payload };
    case "SET_WARD":
      return { ...state, ward: action.payload };
    case "SET_STREET":
      return { ...state, street: action.payload };

    default:
      return state;
  }
}

const initialInfo = { id: "", name: "" };

const initialAddress: AddressType = {
  province: initialInfo,
  district: initialInfo,
  ward: initialInfo,
  street: "",
};

export default function ContactPage() {
  const [address, addressDispatch] = useReducer(reducer, initialAddress);

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
    `https://vapi.vnappmob.com/api/province/district/${address.province.id}`,
    axiosCustomFetcher
  );
  const {
    data: wards,
    error: wards_error,
    isLoading: wards_loading,
  } = useSWR(
    `https://vapi.vnappmob.com/api/province/ward/${address.district.id}`,
    axiosCustomFetcher
  );

  return (
    <>
      <form action={createContact} className="flex justify-center my-8">
        <div className="grid justify-items-center gap-y-4">
          <h3 className="text-2xl font-bold">Liên hệ hợp tác</h3>
          <TextField
            name="hotel_name"
            label="Tên khách sạn"
            variant="outlined"
          ></TextField>
          <TextField
            name="user_fullName"
            label="Họ tên khách hàng"
            variant="outlined"
          ></TextField>
          <TextField
            name="user_email"
            label="Email liên hệ"
            variant="outlined"
          ></TextField>
          <div className="flex justify-center">
            <FormControl>
              <TextField
                name="street"
                label="Đường"
                variant="filled"
              ></TextField>
            </FormControl>
            <FormControl variant="filled" sx={{ mx: 1, minWidth: 240 }}>
              <InputLabel id="select-ward">Phường/Xã</InputLabel>
              <Select
                name="ward"
                label="select-ward"
                MenuProps={{
                  slotProps: { paper: { style: { maxHeight: 200 } } },
                }}
                value={JSON.stringify(address.ward)}
                onChange={(e) =>
                  addressDispatch({
                    type: addressDispatchType.SET_WARD,
                    payload: JSON.parse(e.target.value),
                  })
                }
              >
                {wards != null &&
                  wards.results.length > 0 &&
                  wards.results.map((ward: Ward) => {
                    return (
                      <MenuItem
                        key={ward.ward_id}
                        value={JSON.stringify({
                          id: ward.ward_id,
                          name: ward.ward_name,
                        })}
                      >
                        {ward.ward_name}
                      </MenuItem>
                    );
                  })}
              </Select>
            </FormControl>
            <FormControl variant="filled" sx={{ mx: 1, minWidth: 240 }}>
              <InputLabel id="select-district">Quận/Huyện</InputLabel>
              <Select
                name="district"
                label="select-district"
                MenuProps={{
                  slotProps: { paper: { style: { maxHeight: 200 } } },
                }}
                value={JSON.stringify(address.district)}
                onChange={(e) =>
                  addressDispatch({
                    type: addressDispatchType.SET_DISTRICT,
                    payload: JSON.parse(e.target.value),
                  })
                }
              >
                {districts != null &&
                  districts.results.length > 0 &&
                  districts.results.map((district: District) => {
                    return (
                      <MenuItem
                        key={district.district_id}
                        value={JSON.stringify({
                          id: district.district_id,
                          name: district.district_name,
                        })}
                      >
                        {district.district_name}
                      </MenuItem>
                    );
                  })}
              </Select>
            </FormControl>
            <FormControl variant="filled" sx={{ mx: 1, minWidth: 240 }}>
              <InputLabel id="select-province">Tinh/Thành phố</InputLabel>
              <Select
                name="province"
                value={JSON.stringify(address.province)}
                label="select-province"
                MenuProps={{
                  slotProps: { paper: { style: { maxHeight: 200 } } },
                }}
                onChange={(e) =>
                  addressDispatch({
                    type: addressDispatchType.SET_PROVINCE,
                    payload: JSON.parse(e.target.value),
                  })
                }
              >
                {provinces != null &&
                  provinces.results.length > 0 &&
                  provinces.results.map((province: Province) => {
                    return (
                      <MenuItem
                        key={province.province_id}
                        value={JSON.stringify({
                          id: province.province_id,
                          name: province.province_name,
                        })}
                      >
                        {province.province_name}
                      </MenuItem>
                    );
                  })}
              </Select>
            </FormControl>
          </div>
          <TextareaAutosize
            aria-label="Lời nhắn"
            placeholder="Lời nhắn..."
            minRows={3}
            style={{
              width: "320px",
              padding: "8px 10px",
            }}
          ></TextareaAutosize>
          <Button variant="contained" type="submit">
            Liên hệ
          </Button>
        </div>
      </form>
    </>
  );
}
