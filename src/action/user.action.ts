"use server";

import { hashedPassword } from "@/lib/auth";
import { prisma } from "@/lib/client";
import ShortUniqueId from "short-unique-id";

interface DetailInfo {
  id: string;
  name: string;
}

interface contactRequest {
  hotel_name: string;
  user_fullName: string;
  user_email: string;
  street: string;
  ward: DetailInfo;
  district: DetailInfo;
  province: DetailInfo;
}

// Create new Hotel and User via Transaction
export async function createContact(formData: FormData) {
  //Lấy dữ liệu từ formData
  const newContact: contactRequest = {
    hotel_name: formData.get("hotel_name") as string,
    user_fullName: formData.get("user_fullName") as string,
    user_email: formData.get("user_email") as string,
    street: formData.get("street") as string,
    ward: JSON.parse(formData.get("ward") as string),
    district: JSON.parse(formData.get("district") as string),
    province: JSON.parse(formData.get("province") as string),
  };

  console.log(newContact);

  //Check empty input
  if (
    newContact.hotel_name == "" ||
    newContact.user_fullName == "" ||
    newContact.user_email == "" ||
    newContact.street == "" ||
    newContact.ward == null ||
    newContact.district == null ||
    newContact.province == null
  )
    throw new Error("Request fail");

  //Transaction for create Hotel and User
  try {
    const result = await prisma.$transaction(async (prisma) => {
      const newHotel = await prisma.hotel.create({
        data: {
          name: newContact.hotel_name,
          address: {
            street: newContact.street,
            ward: newContact.ward.name,
            district: newContact.district.name,
            province: newContact.province.name,
          },
        },
      });

      //Create UID for user
      const uid = new ShortUniqueId({ length: 6 });

      const newUser = await prisma.user.create({
        data: {
          id: uid.rnd(),
          username: newContact.user_email,
          password: await hashedPassword("113446"), //Mật khẩu mặc định
          fullName: newContact.user_fullName,
          email: newContact.user_email,
          role: "MANAGER",

          hotel_id: newHotel.id,
        },
      });
      return { newHotel, newUser };
    });
  } catch (error: any) {
    console.log("*Error: " + error.message);
  }
}
