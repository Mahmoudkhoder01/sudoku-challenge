import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { generateBoard, removeCellsFromBoard } from "../Functions/sudoku";
import { hasUniqueSolution } from "../Functions/HasUniqueSolution";

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

      let unique = false;

      while (!unique) {
        // Generate a full valid Sudoku board
        const newBoard = generateBoard();

        // Save the full board before modifying it
        state.fullBoard = newBoard.map((row) => [...row]);

        // Check if the board has a unique solution
        unique = hasUniqueSolution(newBoard);

        removeCellsFromBoard(newBoard, difficulty);

        if (unique) {
          // Assign the board to the state if unique
          state.board = newBoard;

          // Generate locked cells
          const newLockedCells = new Set<string>();
          newBoard.forEach((row, rowIndex) => {
            row.forEach((cell, colIndex) => {
              if (cell !== 0) {
                newLockedCells.add(`${rowIndex}-${colIndex}`);
              }
            });
          });

          state.lockedCells = Array.from(newLockedCells); // Convert Set to Array
        }
      }
    },
  },
});

export const { setBoard, setLockedCells, resetGame, generateNewGame } =
  boardSlice.actions;
export default boardSlice.reducer;
