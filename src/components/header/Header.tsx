import Link from "next/link";
import Card from "../CardDefault";
import HeaderLoginButton from "./HeaderLoginButton";
import { cookies } from "next/headers";

export default function Header() {
  const introspect = cookies().has("login");
  return (
    <Card>
      <div className="flex justify-between">
        <span className="text-2xl font-bold">
          <Link href={"/"}>Trip.com</Link>
        </span>
        <span className="flex space-x-8 items-center">
          <span>
            <Link href={"/contact"}>Liên hệ</Link>
          </span>
          <span>
            <HeaderLoginButton></HeaderLoginButton>
          </span>
        </span>
      </div>
    </Card>
  );
}
