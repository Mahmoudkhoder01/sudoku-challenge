import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { generateBoard, removeCellsFromBoard } from "../Functions/sudoku";

interface BoardState {
  board: number[][];
  fullBoard: number[][];
  lockedCells: string[];
}

const initialState: BoardState = {
  board: [],
  fullBoard: [],
  lockedCells: [],
};

const boardSlice = createSlice({
  name: "board",
  initialState,
  reducers: {
    setBoard(state, action: PayloadAction<number[][]>) {
      state.board = action.payload;
    },
    setFullBoard(state, action: PayloadAction<number[][]>) {
      state.fullBoard = action.payload;
    },
    setLockedCells(state, action: PayloadAction<string[]>) {
      state.lockedCells = action.payload;
    },
    resetGame(
      state,
      action: PayloadAction<{
        board: number[][];
        lockedCells: string[];
      }>
    ) {
      state.board = action.payload.board;
      state.lockedCells = action.payload.lockedCells;
    },
    generateNewGame(state, action: PayloadAction<number>) {
      const difficulty = action.payload;

      const newBoard = generateBoard();

      // Save the full board before modifying it
      state.fullBoard = newBoard.map((row) => [...row]);

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

      state.lockedCells = Array.from(newLockedCells); // Convert Set to Array
    },
  },
});

export const { setBoard, setLockedCells, resetGame, generateNewGame } =
  boardSlice.actions;
export default boardSlice.reducer;
