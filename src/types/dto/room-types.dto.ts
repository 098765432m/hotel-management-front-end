export interface RoomTypeUpdateDto {
  name: string;
  price: number;
  images: {
    public_id: string;
    format: string;
    room_type_id: string;
  }[];
}
