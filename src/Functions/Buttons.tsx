import { Dispatch, SetStateAction } from "react";
import { setBoard } from "../redux/BoardSlice";

// State type
type SelectedCell = { row: number; col: number } | null;

// Function to provide a hint
export const handleHintClick = (
  dispatch: Function,
  fullBoard: number[][],
  board: number[][],
  lockedCells: Set<string>,
  selectedCell: SelectedCell,
  setSelectedCell: Dispatch<SetStateAction<SelectedCell>>
) => {
  // If a cell is selected
  if (selectedCell) {
    const { row, col } = selectedCell;

    // Check if the selected cell is not locked
    if (!lockedCells.has(`${row}-${col}`)) {
      const answer = fullBoard[row][col]; // Get the correct answer from the full board

      // Update the board with the correct answer
      const updatedBoard = board.map((rowArray, rowIndex) =>
        rowIndex === row
          ? rowArray.map((cell, colIndex) => (colIndex === col ? answer : cell))
          : [...rowArray]
      );

      dispatch(setBoard(updatedBoard));

      setSelectedCell(null);
    }
  } else {
    // If no cell is selected, find the first empty cell and if there is a filled cell with a wrong value so fix it
    outerLoop: for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (
          (board[row][col] === 0 && !lockedCells.has(`${row}-${col}`)) ||
          board[row][col] !== fullBoard[row][col]
        ) {
          const answer = fullBoard[row][col]; // Get the correct answer from the full board

          // Update the board with the correct answer
          const updatedBoard = board.map((rowArray, rowIndex) =>
            rowIndex === row
              ? rowArray.map((cell, colIndex) =>
                  colIndex === col ? answer : cell
                )
              : [...rowArray]
          );

          dispatch(setBoard(updatedBoard));

          break outerLoop; // Exit the loop after filling the first empty cell
        }
      }
    }
  }
};

export const handleCheckClick = (board: number[][], fullBoard: number[][]) => {
  // Iterate over every cell to compare the values
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      // If any cell in the board does not match the fullBoard, it is not solved
      if (board[row][col] !== fullBoard[row][col]) {
        console.log("Still working on it!");
        return false; // The board is not solved
      }
    }
  }

  // If all cells match, the Sudoku is solved
  console.log("Congrats! You solved it!");
  return true; // The board is solved
};
