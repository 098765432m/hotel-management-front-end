import { UserRedux } from "@/types/dto/user.dto";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
  authInfo: UserRedux | null;
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
    logIn: (state, action: PayloadAction<UserRedux>) => {
      state.authInfo = action.payload;
      state.isLogin = true;
      console.log("Login: ", state);
    },
    logOut: (state) => {
      state.authInfo = null;
      state.isLogin = false;
    },
  },
});

export const { logIn, logOut } = authSlice.actions;

export default authSlice.reducer;
