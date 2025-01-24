import { configureStore } from "@reduxjs/toolkit";
import counterReducer from "./counter/counterSlice";
import authReducer from "./user/authSlice";

export const store = configureStore({
  reducer: { auth: authReducer, counter: counterReducer },
});

// Export Type
export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
