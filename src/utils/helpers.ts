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

export function NumberToMoneyFormat(number?: number): string {
  let resultString = "",
    mod;

  if (!number) return "0";

  while (true) {
    if (number > 1000) {
      mod = ToModString(number, 1000);
      number = Math.trunc(number / 1000);
      resultString = `.${mod}` + resultString;
    } else {
      return `${number}${resultString}`;
    }
  }
}

export function ToModString(number: number, modNumber: number): string {
  const modResult = number % modNumber;
  let resultString = modResult.toString();
  for (let i = resultString.length; i < modNumber.toString().length - 1; i++) {
    resultString = `0${resultString}`;
  }

  return resultString;
}
