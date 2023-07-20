import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./features/userSlice";
import gridSlice from "./features/grid/gridSlice";
import markesNotFoundSoftone from "./features/syncProduct/markesNotFoundSoftone";
import markesNotFoundAriadne from "./features/syncProduct/markesNotFoundAriadne";

export const store = configureStore({
  reducer: {
    user: userSlice,
    grid: gridSlice,
    notFoundAriadne: markesNotFoundAriadne,
    notFoundSoftone: markesNotFoundSoftone ,
  }
})