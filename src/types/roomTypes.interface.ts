import { Image } from "@prisma/client";

export interface RoomType {
  id: string;
  name: string;
  price: number;
  images: Image[];
}
