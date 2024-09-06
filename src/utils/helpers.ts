import { Room } from "@/types/room.interface";

export function locationToString(Room: Room) {
  return (
    Room.hotel!.address.street +
    ", quận " +
    Room.hotel!.address.ward +
    ", " +
    Room.hotel!.address.province
  );
}
