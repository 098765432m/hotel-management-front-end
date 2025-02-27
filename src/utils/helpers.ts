import { AddressType } from "@/types/address.interface";
import { Role, Status_Booking, Status_Room } from "@prisma/client";

export function addressToString(address: AddressType) {
  return `Đường ${address.street as string}, ${address.ward.name as string}, ${
    address.district.name
  }, ${address.province.name}`;
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

export function transformAddressSelectInput<T extends Entity>(
  entities: T | null
) {
  return entities != null && entities.code === "success"
    ? entities.data
        .sort((a, b) => a.name.localeCompare(b.name))
        .map((entity) => ({
          label: entity.name,
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

// Chuyển status phòng sang Label
export function convertRoomStatusToLabel(status: Status_Room) {
  switch (status) {
    case Status_Room.AVAILABLE:
      return "Trống";
    case Status_Room.OCCUPIED:
      return "Đang sử dụng";
    case Status_Room.MAINTAINANCE:
      return "Bảo trì";
  }
}

// Chuyển status booking sang Label
export function convertBookingStatusToLabel(status: Status_Booking) {
  switch (status) {
    case Status_Booking.BOOKED:
      return "Chờ nhận phòng";
    case Status_Booking.CHECK_IN:
      return "Đã nhận phòng";
    case Status_Booking.PAID:
      return "Đã thanh toán";
  }
}

// Chuyển status user sang Label
export function convertUserStatusToLabel(status: boolean) {
  return status ? "Đã kích hoạt" : "Chưa kích hoạt";
}

// Chuyển role user sang Label
export function convertUserRoleToLabel(status: Role) {
  switch (status) {
    case Role.ADMIN:
      return "Quản trị viên";
    case Role.MANAGER:
      return "Quản lý";
    case Role.STAFF:
      return "Nhân viên";
    case Role.GUEST:
      return "Khách hàng";
  }
}
