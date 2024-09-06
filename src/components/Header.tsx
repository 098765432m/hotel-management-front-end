"use client";

import Link from "next/link";
import Card from "./CardDefault";
import { FaCircleUser } from "react-icons/fa6";

export default function Header() {
  return (
    <Card>
      <div className="flex justify-between">
        <span className="text-2xl font-bold">
          <Link href={"/"}>Trip.com</Link>
        </span>
        <span className="flex space-x-8 items-center">
          <span>Trợ giúp</span>
          <span className="flex space-x-2">
            <span>
              <FaCircleUser size={26}></FaCircleUser>
            </span>
            <span>098765432m</span>
          </span>
        </span>
      </div>
    </Card>
  );
}
