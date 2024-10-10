"use client";

import { FaCircleUser } from "react-icons/fa6";
import Link from "next/link";
import React, { useContext, useState } from "react";
import isAuthenticated, { logOut } from "@/lib/auth";
import { AuthContext } from "@/context/AuthContext";
import { MenuList, Button, Menu, MenuItem } from "@mui/material";
import { useRouter } from "next/navigation";

export default function HeaderLoginButton() {
  const { isLogin, setIsLogin, auth } = useContext(AuthContext);
  const router = useRouter();

  const [anchorE1, setAnchorE1] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorE1);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorE1(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorE1(null);
  };

  return (
    <>
      {isLogin != false ? (
        <>
          <Button
            onClick={handleClick}
            id="avatar-button"
            aria-controls={open ? "avatar-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={open ? "true" : undefined}
          >
            <span className="flex space-x-2">
              <span>
                <FaCircleUser size={26}></FaCircleUser>
              </span>
              <span>{auth.username}</span>
            </span>
          </Button>
          <Menu
            id="basic-menu"
            anchorEl={anchorE1}
            open={open}
            onClose={handleClose}
            MenuListProps={{
              "aria-labelledby": "basic-button",
            }}
          >
            <MenuItem>
              <span
                onClick={() => {
                  setIsLogin(false);
                  logOut();
                  handleClose();
                  router.push("/login");
                }}
              >
                Đăng xuất
              </span>
            </MenuItem>
            <MenuItem>
              <Link href={"/profile"}></Link>
            </MenuItem>
          </Menu>
        </>
      ) : (
        <span>
          <Link href={"/login"}>
            <button>Login</button>
          </Link>
        </span>
      )}
    </>
  );
}
