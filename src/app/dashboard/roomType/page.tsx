import styles from "@/styles/dashboard/room-type/RoomType.module.scss";
import CardDefault from "@/components/custom-component/CardDefault";
import RoomTypeForm from "@/components/dashboard/RoomType/RoomTypeForm";
import RoomTypeList from "@/components/dashboard/RoomType/RoomTypeList";
import { decrypt, SessionPayload } from "@/lib/session";
import { cookies } from "next/headers";

export default async function RoomTypePage() {
  const loginInfoString = cookies().get("login")?.value;
  const loginInfo = (await decrypt(loginInfoString)) as SessionPayload;
  return (
    <div className={styles.room_type_container}>
      <CardDefault>
        <RoomTypeForm></RoomTypeForm>
      </CardDefault>

      <CardDefault>
        <RoomTypeList hotelId={loginInfo?.hotelId ?? null}></RoomTypeList>
      </CardDefault>
    </div>
  );
}
