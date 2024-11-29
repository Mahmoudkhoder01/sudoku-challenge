/**
 * Function to check if a number can be placed in a specific cell on the Sudoku board
 * while ensuring no conflicts with the number's row, column, or 3x3 subgrid.
 *
 * @param board - The current state of the Sudoku board (9x9 grid).
 * @param row - The row index of the cell being checked (0-based).
 * @param col - The column index of the cell being checked (0-based).
 * @param num - The number being checked for validity in the specified cell.
 * @returns A boolean indicating if the number is a valid entry (true) or not (false).
 */
function isValid(
  board: number[][],
  row: number,
  col: number,
  num: number
): boolean {
  // Check the current row and column for conflicts
  for (let i = 0; i < 9; i++) {
    // If the number already exists in the same row or column, it's not valid
    if (board[row][i] === num || board[i][col] === num) {
      return false;
    }
  }

  // Check the 3x3 subgrid for conflicts
  const startRow = Math.floor(row / 3) * 3; // Get the starting row index of the subgrid
  const startCol = Math.floor(col / 3) * 3; // Get the starting column index of the subgrid

  // Loop through the 3x3 subgrid to check if the number already exists
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (board[startRow + i][startCol + j] === num) {
        return false; // Found the number in the subgrid, so the placement is invalid
      }
    }
  }
  // No conflicts found, the number is valid
  return true;
}

/**
 * Function to check if a Sudoku puzzle has a unique solution.
 * It uses a backtracking approach to try filling in the board and count solutions.
 *
 * @param board - The current state of the Sudoku board (9x9 grid).
 * @returns A boolean indicating if the puzzle has exactly one solution (true) or not (false).
 */
export function hasUniqueSolution(board: number[][]): boolean {
  // Counter to track the number of solutions found
  let solutionsCount = 0;

  /**
   * Recursive function to try and find solutions using backtracking.
   *
   * @param board - The current state of the Sudoku board (9x9 grid).
   * @returns A boolean indicating if a solution is found or not.
   */
  function countSolutions(board: number[][]): boolean {
    // If more than one solution is found, return false
    if (solutionsCount > 1) return false; // More than one solution found

    // Loop through the entire board to find empty cells (0 represents empty)
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (board[row][col] === 0) {
          // If the current cell is empty
          // Try placing numbers 1-9 in the empty cell
          for (let num = 1; num <= 9; num++) {
            if (isValid(board, row, col, num)) {
              // Check if placing the number is valid
              board[row][col] = num; // Place the number
              if (countSolutions(board)) {
                // Recursively try to solve the board
                return true; // Solution found
              }
              board[row][col] = 0; // Backtrack by resetting the cell to empty
            }
          }
          return false; // If no valid number can be placed in this cell, return false
        }
      }
    }
    // If no empty cells are left, increment the solution count
    solutionsCount += 1;

    return true; // Solution found
  }

  // Call the countSolutions function and ensure exactly one solution is found
  return countSolutions(board) && solutionsCount === 1;
}
