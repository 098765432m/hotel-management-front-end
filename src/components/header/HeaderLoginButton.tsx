import { FaCircleUser } from "react-icons/fa6";
import Link from "next/link";
interface Props {
  isLogin: boolean;
}

export default function HeaderLoginButton({ isLogin }: Props) {
  if (isLogin)
    return (
      <span className="flex space-x-2">
        <span>
          <FaCircleUser size={26}></FaCircleUser>
        </span>
        <span>098765432m</span>
      </span>
    );
  else
    return (
      <span>
        <Link href={"/login"}>
          <button>Login</button>
        </Link>
      </span>
    );
}
