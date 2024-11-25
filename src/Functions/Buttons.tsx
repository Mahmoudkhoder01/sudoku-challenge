import { Dispatch, SetStateAction } from "react";
import { setBoard } from "../redux/BoardSlice";

// State type
type SelectedCell = { row: number; col: number } | null;
/**
 * Function to provide a hint to the player by filling in a cell with the correct value.
 *
 * If a cell is selected, it will fill the selected cell with the correct value from the solved board.
 * If no cell is selected, it will automatically find the first incorrect or empty cell and fill it with the correct value.
 *
 * @param dispatch - The dispatch function from Redux to update the board state.
 * @param fullBoard - The fully solved Sudoku board containing the correct answers.
 * @param board - The current state of the Sudoku board, which may have incorrect values or empty cells.
 * @param lockedCells - A set containing the coordinates of locked cells that cannot be modified.
 * @param selectedCell - The cell currently selected by the player, or null if no cell is selected.
 * @param setSelectedCell - A function to update the selected cell in the state.
 *
 * @returns void - This function does not return a value, it updates the board state directly.
 */
export const handleHintClick = (
  dispatch: Function,
  fullBoard: number[][], // The solved Sudoku board with the correct answers
  board: number[][], // The current state of the board that may contain errors or empty cells
  lockedCells: Set<string>, // A set containing locked cells that cannot be edited
  selectedCell: SelectedCell, // The cell selected by the user or null if no cell is selected
  setSelectedCell: Dispatch<SetStateAction<SelectedCell>> // Function to update the selected cell state
) => {
  // If a cell is selected by the player
  if (selectedCell) {
    const { row, col } = selectedCell;

    // Check if the selected cell is not locked
    if (!lockedCells.has(`${row}-${col}`)) {
      const answer = fullBoard[row][col]; // Retrieve the correct value from the solved board

      // Update the current board with the correct value for the selected cell
      const updatedBoard = board.map((rowArray, rowIndex) =>
        rowIndex === row
          ? rowArray.map((cell, colIndex) => (colIndex === col ? answer : cell)) // Replace the selected cell with the correct value
          : [...rowArray]
      );

      dispatch(setBoard(updatedBoard)); // Dispatch the updated board to Redux

      setSelectedCell(null); // Deselect the current cell
    }
  } else {
    // If no cell is selected, search for the first incorrect or empty cell and fill it with the correct value
    outerLoop: for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (
          (board[row][col] === 0 && !lockedCells.has(`${row}-${col}`)) || // Check if the cell is empty and not locked
          board[row][col] !== fullBoard[row][col] // Or if the cell has an incorrect value
        ) {
          const answer = fullBoard[row][col]; // Get the correct value from the solved board

          // Update the board with the correct value for the found cell
          const updatedBoard = board.map((rowArray, rowIndex) =>
            rowIndex === row
              ? rowArray.map((cell, colIndex) =>
                  colIndex === col ? answer : cell
                )
              : [...rowArray]
          );

          dispatch(setBoard(updatedBoard)); // Dispatch the updated board to Redux

          break outerLoop; // Exit the loop after updating the first incorrect or empty cell
        }
      }
    }
  }
};

/**
 * Function to check if the Sudoku board is fully solved.
 *
 * This function compares each cell of the current board with the solved board. If all cells match, the board is considered solved.
 *
 * @param board - The current state of the board to be checked.
 * @param fullBoard - The solved Sudoku board to compare against.
 *
 * @returns boolean - Returns true if the board is solved, false if it's not.
 */
export const handleCheckClick = (board: number[][], fullBoard: number[][]) => {
  // Iterate over every cell to compare the values
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      // If any cell in the board does not match the solved board, the Sudoku is not yet solved
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
