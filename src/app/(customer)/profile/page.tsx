import styles from "@/styles/customer/profile/ProfilePage.module.scss";
import CardDefault from "@/components/custom-component/CardDefault";
import ProfileBookingTable from "@/components/customer/profile/ProfileBookingTable";
import ProfileInfo from "@/components/customer/profile/ProfileInfo";
import usersService from "@/services/users.service";
import { cookies } from "next/headers";
import { decrypt, SessionPayload } from "@/lib/session";
import { UserCookieResponse } from "@/types/dto/user.dto";

export default async function ProfilePage() {
  const cookiesStore = cookies(); // Get Cookie on SSR

  const authCookie = await decrypt(cookiesStore.get("login")?.value as string); // Decrypt JWT
  const authInfo: UserCookieResponse = (authCookie as SessionPayload) ?? null; // Convert JWT payload to auth type
  const user = await usersService.GetOne(authInfo.id);

  return (
    <div className={styles.profile_container}>
      <ProfileInfo user_init={user}></ProfileInfo>
      <ProfileBookingTable></ProfileBookingTable>

      <CardDefault>History change</CardDefault>
    </div>
  );
}
