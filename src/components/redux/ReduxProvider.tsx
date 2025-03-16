"use client";

import React, { useEffect } from "react";
import { Provider } from "react-redux";
import { store } from "@/state/store";
import { UserCookieResponse } from "@/types/dto/user.dto";
import { logIn } from "@/state/user/authSlice";

interface Props {
  authInfo: UserCookieResponse;
  children: React.ReactNode;
}

export default function ReduxProvider({ authInfo, children }: Props) {
  useEffect(() => {
    // Preserve Auth Info when refresh page
    if (authInfo != null) {
      store.dispatch(logIn(authInfo));
    }
  }, [authInfo]);

  return <Provider store={store}>{children}</Provider>;
}
