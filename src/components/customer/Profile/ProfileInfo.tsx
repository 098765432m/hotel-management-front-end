"use client";

import { updateAccount } from "@/action/user.action";
// import { AuthContext } from "@/context/AuthContext";
import { axiosCustomFetcher } from "@/lib/fetcher";
import { RootState } from "@/state/store";
import { Button, TextField } from "@mui/material";
import axios from "axios";
import { CldImage, CldUploadWidget } from "next-cloudinary";
import { useContext, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import useSWR from "swr";

export default function ProfileInfo() {
  // const { auth } = useContext(AuthContext);
  const authStore = useSelector((state: RootState) => state.auth);
  const {
    data: user,
    isLoading: isUserLoading,
    error: isUserError,
    mutate: userMutate,
  } = useSWR(
    `${process.env.NEXT_PUBLIC_APP_URL}/api/users/${authStore.authInfo?.id}`,
    axiosCustomFetcher
  );
  const userRef = useRef(user);

  useEffect(() => {
    userRef.current = user;
  }, [user]);

  console.log(user);

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
                  user!.image
                    ? `${user.image.public_id}.${user.image.format}`
                    : "wbhblyipju67ukdval6m.png"
                }`}
                width={380}
                height={600}
                alt="Avatar"
                priority
              ></CldImage>
            </div>
            <div>
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
                          user_id: userRef.current?.id,
                          old_img_public_id:
                            userRef.current?.image?.public_id ?? null,
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
                        console.log(res);

                        userMutate();
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
