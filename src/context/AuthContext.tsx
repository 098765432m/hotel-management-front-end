"use client";

import { UserCookieResponse } from "@/types/dto/user.dto";
import React, { createContext, useState } from "react";

export const AuthContext = createContext<any>(null);

interface Props {
  children: React.ReactNode;
}

//Custom Hook for Auth Provider
export default function AuthProvider({ children }: Props) {
  const [isLogin, setIsLogin] = useState(false);
  const [auth, setAuth] = useState<UserCookieResponse | null>(null);
  return (
    <AuthContext.Provider value={{ isLogin, setIsLogin, auth, setAuth }}>
      {children}
    </AuthContext.Provider>
  );
}
