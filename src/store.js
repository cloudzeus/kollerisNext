import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./features/userSlice";
import gridSlice from "./features/grid/gridSlice";
import catalogSlice from "./features/catalogSlice";

export const store = configureStore({
  reducer: {
    user: userSlice,
    grid: gridSlice,
    catalog: catalogSlice,
  }
})