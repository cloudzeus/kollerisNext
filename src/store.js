import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./features/userSlice";
import gridSlice from "./features/grid/gridSlice";
import catalogSlice from "./features/catalogSlice";
import impaofferSlice from "./features/impaofferSlice";
export const store = configureStore({
  reducer: {
    user: userSlice,
    grid: gridSlice,
    catalog: catalogSlice,
    impaoffer: impaofferSlice
  }
})

// const makeStore = () => store;
// export const wrapper = createWrapper(makeStore, {debug: true});
