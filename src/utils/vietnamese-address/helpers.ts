import { AddressType } from "@/types/address.interface";
import {
  ActionAddress,
  null_address,
} from "@/types/vietnamese-location-api/address";

export function reducerAddress(state: AddressType, action: ActionAddress) {
  switch (action.type) {
    case "SET_PROVINCE":
      return {
        ...state,
        province: action.payload.province,
        district: null_address,
        ward: null_address,
      };
    case "SET_DISTRICT":
      return {
        ...state,
        district: action.payload.district,
        ward: null_address,
      };
    case "SET_WARD":
      return { ...state, ward: action.payload.ward };
    case "SET_STREET":
      return { ...state, street: action.payload.street };

    case "SET_EXISTED":
      return {
        ...state,
        province: action.payload.province,
        district: action.payload.district,
        ward: action.payload.ward,
        street: action.payload.street,
      };

    default:
      return state;
  }
}
