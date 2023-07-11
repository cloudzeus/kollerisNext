import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./features/userSlice";
import gridSlice from "./features/grid/gridSlice";
import uploadSlice from "./features/upload/uploadSlice";
import brandSlice from "./features/brand/brandSlice";
import markesNotFoundSoftone from "./features/syncProduct/markesNotFoundSoftone";
import markesNotFoundAriadne from "./features/syncProduct/markesNotFoundAriadne";

export const store = configureStore({
  reducer: {
    user: userSlice,
    grid: gridSlice,
    upload: uploadSlice,
    notFoundAriadne: markesNotFoundAriadne,
    notFoundSoftone: markesNotFoundSoftone ,
    brand: brandSlice,
  }
})