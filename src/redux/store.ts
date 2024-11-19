import { configureStore } from "@reduxjs/toolkit";
import boardSlice from "./BoardSlice";
import DifficultySlice from "./DifficultySlice";

export const store = configureStore({
  reducer: {
    board: boardSlice,
    difficulty: DifficultySlice,
  },
});

// Type for dispatch, inferred from the store itself
export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
