"use client";

import { FaCircleUser } from "react-icons/fa6";
import NextLink from "../custom-component/NextLink";
import React, { useState } from "react";
import { logOut as logOutFromLib } from "@/lib/auth";
import { Button, Menu, MenuItem } from "@mui/material";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/state/store";
import { logOut as logOutFromStore } from "@/state/user/authSlice";

export default function HeaderLoginButton() {
  const authInfo = useSelector((state: RootState) => state.auth.authInfo);
  const isLogin = useSelector((state: RootState) => state.auth.isLogin);
  const dispatch = useDispatch<AppDispatch>();
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
              <span>{authInfo?.username}</span>
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
              <NextLink href={"/profile"}>Trang cá nhân</NextLink>
            </MenuItem>
            <MenuItem>
              <span
                onClick={async () => {
                  await logOutFromLib();
                  dispatch(logOutFromStore());
                  handleClose();
                  router.push("/login");
                }}
              >
                Đăng xuất
              </span>
            </MenuItem>
          </Menu>
        </>
      ) : (
        <span>
          <NextLink href={"/login"}>Login</NextLink>
        </span>
      )}
    </>
  );
}
