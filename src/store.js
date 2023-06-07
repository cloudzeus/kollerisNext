import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./features/userSlice";
import gridSlice from "./features/grid/gridSlice";
import uploadSlice from "./features/upload/uploadSlice";
export const store = configureStore({
  reducer: {
    user: userSlice,
    grid: gridSlice,
    upload: uploadSlice,
  }
})