import CardDefault from "@/components/CardDefault";
import RoomTypeForm from "@/components/dashboard/RoomType/RoomTypeForm";
import RoomTypeList from "@/components/dashboard/RoomType/RoomTypeList";
import { Input, InputNumber, Button, Form, Skeleton } from "antd";
import { decrypt, SessionPayload } from "@/lib/session";
import roomTypesServices from "@/services/roomTypes.services";
import { cookies } from "next/headers";
import { RoomType } from "@/types/roomTypes.interface";

export default async function RoomTypePage() {
  const loginInfoString = cookies().get("login")?.value;
  const loginInfo = await decrypt(loginInfoString);
  const { hotelId } = loginInfo as SessionPayload;

  const RoomTypes: RoomType[] = await roomTypesServices.getAllByHotel(hotelId);
  return (
    <>
      <CardDefault>
        <RoomTypeForm></RoomTypeForm>
      </CardDefault>

      <CardDefault>
        <RoomTypeList
          hotelId={hotelId as string}
          RoomTypes={RoomTypes}
        ></RoomTypeList>
      </CardDefault>
    </>
  );
}
