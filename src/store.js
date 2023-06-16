import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./features/userSlice";
import gridSlice from "./features/grid/gridSlice";
import uploadSlice from "./features/upload/uploadSlice";
import compareDatabasesSlice from "./features/compareDatabases/compareDatabasesSlice";
export const store = configureStore({
  reducer: {
    user: userSlice,
    grid: gridSlice,
    upload: uploadSlice,
    compareDatabases: compareDatabasesSlice,
  }
})