import { AddressType } from "@/types/address.interface";

export function addressToString(address: AddressType) {
  return `Đường ${address.street}, ${address.ward.name}, ${address.district.name}, ${address.province.name}`;
}

type Entity = {
  code: string;
  data: {
    id: string;
    name: string;
  }[];
};

export function transformAddressEntity<T extends Entity>(entities: T | null) {
  return entities != null && entities.code === "success"
    ? entities.data
        .sort((a, b) => a.name.localeCompare(b.name))
        .map((entity) => ({
          name: entity.name,
          value: entity.id,
        }))
    : null;
}
