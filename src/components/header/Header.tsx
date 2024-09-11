import Link from "next/link";
import Card from "../CardDefault";
import HeaderLoginButton from "./HeaderLoginButton";

export default function Header() {
  const introspect = false;
  return (
    <Card>
      <div className="flex justify-between">
        <span className="text-2xl font-bold">
          <Link href={"/"}>Trip.com</Link>
        </span>
        <span className="flex space-x-8 items-center">
          <span>Trợ giúp</span>
          <span>
            <HeaderLoginButton isLogin={introspect}></HeaderLoginButton>
          </span>
        </span>
      </div>
    </Card>
  );
}
