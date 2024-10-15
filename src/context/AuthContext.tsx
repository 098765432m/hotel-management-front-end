"use client";

import { UserCookieResponse } from "@/types/dto/user.dto";
import React, { createContext, useState } from "react";

export const AuthContext = createContext<any>(null);

interface Props {
  authInfo: UserCookieResponse;
  children: React.ReactNode;
}

//Custom Hook for Auth Provider
export default function AuthProvider({ authInfo, children }: Props) {
  const [auth, setAuth] = useState<UserCookieResponse | null>(authInfo ?? null); // Init authInfo to preserve data after refresh page via cookie
  const [isLogin, setIsLogin] = useState(auth != null ? true : false); // Preserve data via auth

  return (
    <AuthContext.Provider value={{ isLogin, setIsLogin, auth, setAuth }}>
      {children}
    </AuthContext.Provider>
  );
}
