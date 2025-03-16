import { UserCookieResponse } from "@/types/dto/user.dto";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
  authInfo: UserCookieResponse | null;
  isLogin: boolean;
}

const initialState: AuthState = {
  authInfo: null,
  isLogin: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logIn: (state, action: PayloadAction<UserCookieResponse>) => {
      state.authInfo = action.payload;
      state.isLogin = true;
    },
    logOut: (state) => {
      state.authInfo = null;
      state.isLogin = false;
    },
  },
});

export const { logIn, logOut } = authSlice.actions;

export default authSlice.reducer;
