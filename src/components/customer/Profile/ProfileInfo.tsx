"use client";

import { updateAccount } from "@/action/user.action";
import { AuthContext } from "@/context/AuthContext";
import { axiosCustomFetcher } from "@/lib/fetcher";
import { Button, TextField } from "@mui/material";
import axios from "axios";
import { CldImage, CldUploadWidget } from "next-cloudinary";
import { useContext, useEffect, useRef, useState } from "react";
import useSWR from "swr";

export default function ProfileInfo() {
  const { auth } = useContext(AuthContext);
  const {
    data: user,
    isLoading: isUserLoading,
    error: isUserError,
    mutate: userMutate,
  } = useSWR(
    `${process.env.NEXT_PUBLIC_APP_URL}/api/users/${auth.id}`,
    axiosCustomFetcher
  );
  const userRef = useRef(user);

  useEffect(() => {
    userRef.current = user;
  }, [user]);

  console.log("useSWR: ");
  console.log(userRef.current);

  if (!isUserLoading)
    return (
      <>
        <div className="flex gap-4">
          <>
            <div>
              <CldImage
                src={`${process.env.NEXT_PUBLIC_CLOUDINARY_URL}/${
                  process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
                }/image/upload/v1/${
                  user?.img_public_id != "" && user?.img_public_id != undefined
                    ? `${user.img_public_id}.${user.img_format}`
                    : "wbhblyipju67ukdval6m.png"
                }`}
                width={380}
                height={600}
                alt="Test Anh"
              ></CldImage>
            </div>
            <div>
              {user.img_public_id}
              <CldUploadWidget
                signatureEndpoint={`/api/sign-cloudinary-params`}
                onSuccess={(result) => {
                  console.log("onSuccess");

                  console.log(userRef.current);

                  if (result.info != null && typeof result.info === "object") {
                    axios
                      .post(
                        `${process.env.NEXT_PUBLIC_APP_URL}/api/updateAvatar`,
                        {
                          id: userRef.current?.id,
                          old_img_public_id: userRef.current?.img_public_id,
                          img_public_id: result.info.public_id,
                          img_format: result.info.format,
                        },
                        {
                          headers: {
                            "Content-Type": "application/json",
                          },
                        }
                      )
                      .then((res) => {
                        userMutate({
                          ...user,
                          img_public_id: res.data.img_public_id,
                          img_format: res.data.img_format,
                        });
                      })
                      .catch((err) => {
                        console.error("Error saving Image: ", err);
                      });
                  }
                }}
              >
                {({ open }) => {
                  return <Button onClick={() => open()}>Upload</Button>;
                }}
              </CldUploadWidget>
            </div>
          </>
          <form
            action={updateAccount}
            className="grid justify-items-center gap-2"
          >
            <TextField
              name="username"
              label="Tên tài khoản"
              variant="outlined"
              defaultValue={user.username}
            ></TextField>
            <TextField
              name="fullName"
              label="Họ và tên"
              variant="outlined"
              defaultValue={user.fullName}
            ></TextField>
            <TextField
              name="email"
              label="Địa chỉ email"
              variant="outlined"
              defaultValue={user.email}
            ></TextField>
            <Button variant="contained" type="submit">
              Chỉnh sửa
            </Button>
          </form>
        </div>
      </>
    );
}
