"use server";
import { prisma } from "@/lib/client";
export async function roomCreate(formData: FormData) {
  const body = {
    name: formData.get("roomName") as string,
    description: formData.get("description") as string,
    room_type_id: formData.get("roomType") as string,
    hotel_id: formData.get("hotelId") as string,
  };

  const result = await prisma.room.create({
    data: body,
  });
}
