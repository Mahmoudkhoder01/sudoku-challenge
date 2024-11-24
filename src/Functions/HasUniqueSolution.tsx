// Check if placing num in the cell is valid
function isValid(
  board: number[][],
  row: number,
  col: number,
  num: number
): boolean {
  for (let i = 0; i < 9; i++) {
    // Check row, column, and subgrid
    if (board[row][i] === num || board[i][col] === num) {
      return false;
    }
  }

  const startRow = Math.floor(row / 3) * 3;
  const startCol = Math.floor(col / 3) * 3;

  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (board[startRow + i][startCol + j] === num) {
        return false;
      }
    }
  }
  return true;
}

// Check if the puzzle has a unique solution
export function hasUniqueSolution(board: number[][]): boolean {
  let solutionsCount = 0;

  function countSolutions(board: number[][]): boolean {
    if (solutionsCount > 1) return false; // More than one solution found

    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (board[row][col] === 0) {
          // Try numbers 1-9
          for (let num = 1; num <= 9; num++) {
            if (isValid(board, row, col, num)) {
              board[row][col] = num;
              if (countSolutions(board)) {
                return true;
              }
              board[row][col] = 0; // Backtrack
            }
          }
          return false; // No valid number can be placed here
        }
      }
    }
    solutionsCount += 1;

    return true;
  }

  return countSolutions(board) && solutionsCount === 1;
}
