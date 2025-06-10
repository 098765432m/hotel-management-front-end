import { configureStore } from "@reduxjs/toolkit";
import counterReducer from "./counter/counterSlice";
import authReducer from "./user/authSlice";
import searchHotelFormReducer from "@/state/search-hotel-form/searchHotelForm";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    counter: counterReducer,
    searchHotelForm: searchHotelFormReducer,
  },
});

// Export Type
export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
