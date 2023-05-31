import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./features/userSlice";
import gridSlice from "./features/gridSlice";

export const store = configureStore({
  reducer: {
    user: userSlice,
    grid: gridSlice,
  }
})