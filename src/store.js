import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./features/userSlice";
import gridSlice from "./features/grid/gridSlice";
import catalogSlice from "./features/catalogSlice";
import impaofferSlice from "./features/impaofferSlice";
import supplierOrderSlice from "./features/supplierOrderSlice";
import productsSlice from "./features/productsSlice";
import pdfSlice from "./features/pdfSlice";
import { combineReducers } from 'redux'
import storage from 'redux-persist/lib/storage'
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist'

const persistConfig = {
  key: 'root',
  version: 1,
  storage,
  blacklist: ['products', 'user', 'catalog'],

}
const reducers = combineReducers({
    user: userSlice,
    grid: gridSlice,
    catalog: catalogSlice,
    impaoffer: impaofferSlice,
    supplierOrder: supplierOrderSlice,
    products: productsSlice,
    pdf: pdfSlice,
})




const persistedReducer = persistReducer(persistConfig, reducers)

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
})




export const  persistor = persistStore(store)

// const makeStore = () => store;
// export const wrapper = createWrapper(makeStore, {debug: true});
