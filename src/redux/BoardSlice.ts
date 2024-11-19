// BoardSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { generateBoard, removeCellsFromBoard } from "../Functions/sudoku";

interface BoardState {
  board: number[][];
  lockedCells: Set<string>;
}

const initialState: BoardState = {
  board: [],
  lockedCells: new Set(),
};

const boardSlice = createSlice({
  name: "board",
  initialState,
  reducers: {
    setBoard(state, action: PayloadAction<number[][]>) {
      state.board = action.payload;
    },
    setLockedCells(state, action: PayloadAction<Set<string>>) {
      state.lockedCells = action.payload;
    },
    resetGame(
      state,
      action: PayloadAction<{ board: number[][]; lockedCells: Set<string> }>
    ) {
      state.board = action.payload.board;
      state.lockedCells = action.payload.lockedCells;
    },
    generateNewGame(state, action: PayloadAction<number>) {
      const difficulty = action.payload;

      const newBoard = generateBoard();

      removeCellsFromBoard(newBoard, difficulty);

      const newLockedCells = new Set<string>();

      newBoard.forEach((row, rowIndex) => {
        row.forEach((cell, colIndex) => {
          if (cell !== 0) {
            newLockedCells.add(`${rowIndex}-${colIndex}`);
          }
        });
      });

      state.board = newBoard;

      state.lockedCells = newLockedCells;
    },
  },
});

export const { setBoard, setLockedCells, resetGame, generateNewGame } =
  boardSlice.actions;
export default boardSlice.reducer;
