import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface DifficultyState {
  difficulty: "Easy" | "Medium" | "Hard";
}

const initialState: DifficultyState = {
  difficulty: "Easy", // Default difficulty level
};

const difficultySlice = createSlice({
  name: "difficulty",
  initialState,
  reducers: {
    setDifficulty(state, action: PayloadAction<"Easy" | "Medium" | "Hard">) {
      state.difficulty = action.payload;
    },
  },
});

export const { setDifficulty } = difficultySlice.actions;
export default difficultySlice.reducer;
