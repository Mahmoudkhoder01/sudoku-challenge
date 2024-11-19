import { configureStore } from "@reduxjs/toolkit";
import boardSlice from "./BoardSlice";

export const store = configureStore({
  reducer: {
    board: boardSlice,
  },
});

// Type for dispatch, inferred from the store itself
export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
