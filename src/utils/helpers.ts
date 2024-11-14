import { AddressType } from "@/types/address.interface";

export function addressToString(address: AddressType) {
  return `Đường ${address.street}, ${address.ward.name}, ${address.district.name}, ${address.province.name}`;
}
