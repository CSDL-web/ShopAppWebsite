import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";
import auth from "./authSlice";
import cartReducer from "./cart";
import user from "./user";
import categories from "./categories";
import products from "./products";
import orderReducer from "./orderSlice";

export type DynamicKeyObject = Record<string, any>;

const authPersistConfig = {
  key: "auth",
  storage,
  whitelist: [
    "user",
    "isLogin",
    "target",
    "userInfo",
    "originalNavMenu",
    "treeMenu",
  ],
  version: 1,
};

const reducers = {
  auth: persistReducer(authPersistConfig, auth),
  cart: cartReducer,
  user,
  categories,
  products,
  order: orderReducer,
};

const rootReducer = combineReducers(reducers);

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

export const useAppDispatch: () => AppDispatch = useDispatch;

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
