import { decrypt, SessionPayload } from "@/lib/session";
import { cookies } from "next/headers";
import RoomTypeComponent from "@/components/dashboard/RoomType/RoomTypeComponent";

export default async function RoomTypePage() {
  const loginInfoString = cookies().get("login")?.value;
  const loginInfo = (await decrypt(loginInfoString)) as SessionPayload;
  return (
    <>
      <RoomTypeComponent loginInfo={loginInfo}></RoomTypeComponent>
    </>
  );
}
