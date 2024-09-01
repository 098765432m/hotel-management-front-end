import { Room } from "@/types/room.interface";

export function locationToString(Room: Room) {
  return (
    Room.location.street +
    ", quận " +
    Room.location.ward +
    ", " +
    Room.location.city
  );
}
