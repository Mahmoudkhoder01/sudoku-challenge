/**
 * Function to check if a row in the Sudoku board is valid.
 * A row is valid if it contains no duplicate numbers (excluding 0).
 *
 * @param board - The current state of the Sudoku board (9x9 grid).
 * @param rowIndex - The index of the row to be checked (0 to 8).
 *
 * @returns `true` if the row is valid, otherwise `false`.
 */
function isRowValid(board: number[][], rowIndex: number): boolean {
  let numbersBitset = 0; // Bitset to track numbers that have already been seen in the row

  // Iterate through each cell in the row
  for (let i = 0; i < 9; i++) {
    const cellValue = board[rowIndex][i]; // Get the value of the current cell

    if (cellValue === 0) {
      // If the cell is empty (0), skip it
      continue;
    }

    // Check if the number has already been seen in the row
    if (numbersBitset & (1 << cellValue)) {
      return false; // If the number is already seen, the row is invalid
    }

    // Mark the number as seen by setting the corresponding bit in the bitset
    numbersBitset |= 1 << cellValue;
  }

  // If no duplicates were found, the row is valid
  return true;
}

/**
 * Function to check if a column in the Sudoku board is valid.
 * A column is valid if it contains no duplicate numbers (excluding 0).
 *
 * @param board - The current state of the Sudoku board (9x9 grid).
 * @param columnIndex - The index of the column to be checked (0 to 8).
 *
 * @returns `true` if the column is valid, otherwise `false`.
 */
function isColumnValid(board: number[][], columnIndex: number): boolean {
  let numbersBitset = 0; // Bitset to track numbers that have already been seen in the column

  // Iterate through each cell in the column
  for (let i = 0; i < 9; i++) {
    const cellValue = board[i][columnIndex]; // Get the value of the current cell

    if (cellValue === 0) {
      // If the cell is empty (0), skip it
      continue;
    }

    // Check if the number has already been seen in the column
    if (numbersBitset & (1 << cellValue)) {
      return false; // If the number is already seen, the column is invalid
    }

    // Mark the number as seen by setting the corresponding bit in the bitset
    numbersBitset |= 1 << cellValue;
  }

  // If no duplicates were found, the column is valid
  return true;
}

/**
 * Calculates the real (absolute) index of a cell in a 9x9 Sudoku board,
 * given the subgrid and cell indices within that subgrid.
 *
 * @param subgridIndex - The index of the 3x3 subgrid (ranging from 0 to 8).
 * @param cellIndex - The index of the cell within the 3x3 subgrid (ranging from 0 to 8).
 *
 * @returns A tuple [realRowIndex, realColumnIndex], which is the absolute position of the cell in the 9x9 grid.
 */
function calcCellRealIndex(
  subgridIndex: number, // The index of the 3x3 subgrid (0 to 8)
  cellIndex: number // The index of the cell within the 3x3 subgrid (0 to 8)
): [number, number] {
  // Calculate the starting x (column) and y (row) positions of the subgrid in the 9x9 grid.
  const startx = subgridIndex % 3; // This gives the column offset for the subgrid (0, 1, or 2).
  const starty = Math.floor(subgridIndex / 3); // This gives the row offset for the subgrid (0, 1, or 2).

  // Calculate the position of the cell within the subgrid.
  const cellx = cellIndex % 3; // This gives the column position of the cell within the subgrid (0, 1, or 2).
  const celly = Math.floor(cellIndex / 3); // This gives the row position of the cell within the subgrid (0, 1, or 2).

  // Calculate the real (absolute) position of the cell in the 9x9 grid by adding the subgrid offsets to the cell's position.
  return [startx * 3 + cellx, starty * 3 + celly];
  // The result is an array where:
  // - startx * 3 + cellx is the absolute column index in the 9x9 grid.
  // - starty * 3 + celly is the absolute row index in the 9x9 grid.
}

/**
 * Finds all valid empty cells in a given 3x3 subgrid that can be filled with a specific number (answer),
 * ensuring that the number does not violate Sudoku's row and column constraints.
 *
 * @param board - The current state of the Sudoku board (9x9 grid).
 * @param subgridIndex - The index of the 3x3 subgrid (0-8).
 * @param answer - The number to be tested for validity in the empty cells.
 *
 * @returns An array of coordinates [row, column] representing valid cells in the subgrid.
 */
function getSubgridValidCells(
  board: number[][], // The current state of the Sudoku board (9x9 grid)
  subgridIndex: number, // The index of the subgrid (0 to 8)
  answer: number // The number to test for validity in the subgrid
) {
  const indicies: [number, number][] = []; // Array to store valid cell coordinates

  // Iterate over each cell in the 3x3 subgrid (9 cells in total)
  for (let i = 0; i < 9; i++) {
    // Get the real (absolute) coordinates of the cell in the 9x9 grid from the subgrid and cell index
    const cellIndex = calcCellRealIndex(subgridIndex, i);
    const originalCellValue = board[cellIndex[1]][cellIndex[0]]; // Get the original value of the cell

    // If the cell is not empty (value other than 0), skip it
    if (originalCellValue !== 0) {
      continue;
    }

    // Temporarily set the cell to the answer number for validation
    board[cellIndex[1]][cellIndex[0]] = answer;

    // Check if placing the number in this cell keeps the row and column valid
    if (isRowValid(board, cellIndex[1]) && isColumnValid(board, cellIndex[0])) {
      // If valid, add the cell's coordinates to the result list
      indicies.push(cellIndex);
    }

    // Restore the original value of the cell
    board[cellIndex[1]][cellIndex[0]] = originalCellValue;
  }

  // Return the list of valid cells in the subgrid
  return indicies;
}

/**
 * Function to generate a random integer between a specified range [min, max).
 *
 * @param min - The minimum value of the range (inclusive).
 * @param max - The maximum value of the range (exclusive).
 *
 * @returns A random integer between `min` (inclusive) and `max` (exclusive).
 */
function randrange(min: number, max: number): number {
  // Generate a random floating-point number between 0 (inclusive) and 1 (exclusive)
  // Then scale it to the range [0, max - min), and shift it by adding min to the result.
  return Math.floor(Math.random() * (max - min) + min);
}

/**
 * Function to generate a valid Sudoku board.
 * This function uses a backtracking approach to generate a valid board.
 *
 * @returns A valid 9x9 Sudoku board as a 2D array of numbers.
 */
export function generateBoard(): number[][] {
  /**
   * Helper function to generate an uncertain Sudoku board.
   * It attempts to fill the board with valid numbers. If it fails at any point, it returns null.
   *
   * @returns A valid 9x9 Sudoku board if possible, or null if it's not possible to generate one.
   */
  function generateBoardUncertain(): number[][] | null {
    // Initialize a 9x9 board with zeros (empty cells)
    const board: number[][] = [];

    // Fill the board with zeros (representing empty cells)
    for (let j = 0; j < 9; j++) {
      const row: number[] = [];
      for (let i = 0; i < 9; i++) {
        row.push(0); // Empty cell represented by 0
      }
      board.push(row); // Add the row to the board
    }

    // Try to place digits 1 to 9 in each of the subgrids
    for (let digit = 1; digit <= 9; digit++) {
      for (let subgridIndex = 0; subgridIndex < 9; subgridIndex++) {
        // Get the valid cells where the current digit can be placed in the subgrid
        const validCells = getSubgridValidCells(board, subgridIndex, digit);

        // If no valid cells are found, return null (cannot complete the board)
        if (validCells.length === 0) {
          return null; // Board generation failed at this point
        }

        // Randomly select one of the valid cells to place the digit
        const cellIndex = randrange(0, validCells.length);
        const cell = validCells[cellIndex];

        // Place the digit in the selected cell
        board[cell[1]][cell[0]] = digit;
      }
    }

    // Return the completed board if all digits have been placed successfully
    return board;
  }

  // Declare the board as null initially
  let board: number[][] | null = null;

  // Keep trying to generate a valid board until one is successfully generated
  while (board == null) {
    board = generateBoardUncertain();
  }

  // Return the valid board once generated
  return board;
}

/**
 * Function to remove random cells from a completed Sudoku board to create a puzzle.
 * It sets a specified number of cells to 0 (empty) while preserving the puzzle's validity.
 *
 * @param board - The 9x9 Sudoku board that will have cells removed.
 * @param numberOfCells - The number of cells to be removed (set to 0).
 */
export function removeCellsFromBoard(board: number[][], numberOfCells: number) {
  // Create an array of available cell indices (0-80) representing all the cells in the 9x9 board.
  const availableCells: number[] = Array.from(
    { length: 81 },
    (_, index) => index // The index represents the cell's position in a 1D array (from 0 to 80)
  );

  // Loop to remove the specified number of cells from the board
  for (let i = 0; i < numberOfCells; i++) {
    // Select a random index from the available cells array
    const cellListIndex = randrange(0, availableCells.length);

    // Get the cell's index from the available cells list
    const cellIndex = availableCells[cellListIndex];

    // Calculate the x (column) and y (row) positions of the cell on the 9x9 board
    const cellX = cellIndex % 9; // The column is the remainder of the cell index divided by 9
    const cellY = Math.floor(cellIndex / 9); // The row is the quotient of the cell index divided by 9

    // Set the selected cell on the board to 0 (empty cell)
    board[cellY][cellX] = 0;

    // Remove the selected cell from the available cells list to avoid selecting it again
    availableCells.splice(cellListIndex, 1);
  }
}

/**
 * Function to determine the number of cells to remove from a completed Sudoku board
 * based on the chosen difficulty level.
 *
 * @param difficulty - The difficulty level of the Sudoku puzzle ("Easy", "Medium", or "Hard").
 * @returns The number of cells to remove for the given difficulty.
 */
export const getCellsToRemove = (difficulty: string) => {
  // Switch statement to return the number of cells to remove based on the difficulty level
  switch (difficulty) {
    case "Easy":
      return 30; // Easy difficulty removes 30 cells from the board
    case "Medium":
      return 40; // Medium difficulty removes 40 cells from the board
    case "Hard":
      return 50; // Hard difficulty removes 50 cells from the board
    default:
      return 30; // Default to Easy (remove 30 cells) if the difficulty level is invalid or not provided
  }
};

/**
 * Function to check if a number can be placed in a specific cell on the Sudoku board
 * while ensuring no conflicts with the number's row, column, or 3x3 subgrid.
 * Also ensures that any locked cells with conflicting values are not overwritten.
 *
 * @param board - The current state of the Sudoku board (9x9 grid).
 * @param lockedCells - A set of locked cell positions (formatted as "row-col" strings) where values cannot be modified.
 * @param row - The row index of the cell being checked (0-based).
 * @param col - The column index of the cell being checked (0-based).
 * @param number - The number being checked for validity in the specified cell.
 * @returns A boolean indicating if the number is a valid entry (true) or not (false).
 */
export const isValidEntry = (
  board: number[][],
  lockedCells: Set<string>,
  row: number,
  col: number,
  number: number
): boolean => {
  // Check for duplicates in the same row
  for (let i = 0; i < 9; i++) {
    // If the same number is found in the row and the conflicting cell is locked, return false
    if (
      board[row][i] === number &&
      lockedCells.has(`${row}-${i}`) // Ensure the conflicting cell is locked
    ) {
      return false;
    }
  }

  // Check for duplicates in the same column
  for (let i = 0; i < 9; i++) {
    // If the same number is found in the column and the conflicting cell is locked, return false
    if (
      board[i][col] === number &&
      lockedCells.has(`${i}-${col}`) // Ensure the conflicting cell is locked
    ) {
      return false;
    }
  }

  // Check for duplicates in the 3x3 subgrid containing the target cell
  const subgridRowStart = Math.floor(row / 3) * 3; // Calculate the starting row index of the subgrid
  const subgridColStart = Math.floor(col / 3) * 3; // Calculate the starting column index of the subgrid

  for (let i = subgridRowStart; i < subgridRowStart + 3; i++) {
    for (let j = subgridColStart; j < subgridColStart + 3; j++) {
      // If the same number is found in the subgrid and the conflicting cell is locked, return false
      if (
        board[i][j] === number &&
        lockedCells.has(`${i}-${j}`) // Ensure the conflicting cell is locked
      ) {
        return false;
      }
    }
  }

  // If no conflicts are found, the number is valid and can be placed in the specified cell
  return true;
};

// alternative way instead of using bitwise operator

/**
 * Function to check if a row in the Sudoku board is valid.
 * This function ensures there are no duplicate non-zero numbers in the specified row.
 *
 * @param board - The current state of the Sudoku board (9x9 grid).
 * @param rowIndex - The index of the row to be checked (0-based).
 * @returns A boolean indicating if the row is valid (true) or invalid (false).
 */
// function isRowValid(board: number[][], rowIndex: number): boolean {
//   const encounteredNumbers: boolean[] = new Array(9).fill(false); // Array to track encountered numbers (1-9)

//   for (let i = 0; i < 9; i++) {
//     const cellValue = board[rowIndex][i]; // Get the value of the current cell

//     if (cellValue === 0) continue; // Skip empty cells

// If the number has already been encountered in the row, return false (duplicate found)
//     if (encounteredNumbers[cellValue - 1]) {
//       return false;
//     }

// Mark the number as encountered
//     encounteredNumbers[cellValue - 1] = true;
//   }

//   return true; // No duplicates found, the row is valid
// }

/**
 * Function to check if a column in the Sudoku board is valid.
 * This function ensures there are no duplicate non-zero numbers in the specified column.
 *
 * @param board - The current state of the Sudoku board (9x9 grid).
 * @param columnIndex - The index of the column to be checked (0-based).
 * @returns A boolean indicating if the column is valid (true) or invalid (false).
 */
// function isColumnValid(board: number[][], columnIndex: number): boolean {
//   const encounteredNumbers: boolean[] = new Array(9).fill(false); // Array to track encountered numbers (1-9)

//   for (let i = 0; i < 9; i++) {
//     const cellValue = board[i][columnIndex]; // Get the value of the current cell

//     if (cellValue === 0) continue; // Skip empty cells

// If the number has already been encountered in the column, return false (duplicate found)
//     if (encounteredNumbers[cellValue - 1]) {
//       return false;
//     }

// Mark the number as encountered
//     encounteredNumbers[cellValue - 1] = true;
//   }

//   return true; // No duplicates found, the column is valid
// }

/**
 * Function to solve the Sudoku board using backtracking.
 * The board is assumed to be partially filled with some numbers already in place.
 * This function modifies the board in place.
 *
 * @param board - The current state of the Sudoku board (9x9 grid).
 * @returns `true` if the board is solvable, otherwise `false`.
 */
export function solveSudoku(board: number[][]): number[][] {
  // Helper function to check if a number is valid at a specific row, column
  function isValid(
    board: number[][],
    row: number,
    col: number,
    num: number
  ): boolean {
    // Check the row
    for (let i = 0; i < 9; i++) {
      if (board[row][i] === num) return false;
    }

    // Check the column
    for (let i = 0; i < 9; i++) {
      if (board[i][col] === num) return false;
    }

    // Check the 3x3 subgrid
    const startRow = Math.floor(row / 3) * 3;
    const startCol = Math.floor(col / 3) * 3;
    for (let i = startRow; i < startRow + 3; i++) {
      for (let j = startCol; j < startCol + 3; j++) {
        if (board[i][j] === num) return false;
      }
    }

    return true;
  }

  // Helper function to find the next empty cell (0)
  function findEmptyCell(board: number[][]): [number, number] | null {
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (board[row][col] === 0) {
          return [row, col];
        }
      }
    }
    return null; // No empty cell, board is solved
  }

  // Backtracking function to solve the board
  function backtrack(board: number[][]): boolean {
    const emptyCell = findEmptyCell(board);
    if (!emptyCell) {
      return true; // No empty cells left, the board is solved
    }

    const [row, col] = emptyCell;

    // Try placing numbers from 1 to 9
    for (let num = 1; num <= 9; num++) {
      if (isValid(board, row, col, num)) {
        board[row][col] = num; // Place the number

        if (backtrack(board)) {
          return true; // If solved, return true
        }

        // If placing num didn't work, backtrack
        board[row][col] = 0;
      }
    }

    return false; // Trigger backtracking if no valid number is found
  }

  const isSolved = backtrack(board);
  return isSolved ? board : []; // Return the solved board, or null if unsolvable
}
