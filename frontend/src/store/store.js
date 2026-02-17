import { configureStore } from "@reduxjs/toolkit";
import { analyticsApi } from "./analyticsApi";

export const store = configureStore({
  reducer: {
    [analyticsApi.reducerPath]: analyticsApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(analyticsApi.middleware),
});
