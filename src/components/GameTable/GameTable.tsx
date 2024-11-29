import { Dispatch, SetStateAction, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../../redux/store";
import { generateNewGame, setBoard } from "../../redux/BoardSlice";
import "./GameTable.css";
import { setDifficulty } from "../../redux/DifficultySlice";
import { isValidEntry } from "../../Functions/sudoku";
import { AlertStates } from "../../Game";

// Define the type for props
interface GameTableProps {
  setSelectedCell: React.Dispatch<
    SetStateAction<{ row: number; col: number } | null | null>
  >;
  setAlert: Dispatch<SetStateAction<AlertStates | null>>;
}

const GameTable: React.FC<GameTableProps> = ({ setSelectedCell, setAlert }) => {
  // Access the board state from the Redux store
  const board = useSelector((state: RootState) => state.board.board);

  // Access the locked cells state from Redux store and convert to a Set for quick lookup
  const lockedCellsArray = useSelector(
    (state: RootState) => state.board.lockedCells
  );
  const lockedCells = new Set(lockedCellsArray);

  // Use the dispatch function to send actions to Redux
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    // If the board is empty, generate a new game
    if (board.length === 0) {
      // Define possible number of cells to remove for different difficulties
      const difficulties = [30, 40, 50];

      // Randomly select how many cells to remove based on difficulty
      const randomCellsToRemove =
        difficulties[Math.floor(Math.random() * difficulties.length)];

      // Dispatch an action to generate a new game with the selected difficulty
      dispatch(generateNewGame(randomCellsToRemove));

      // Set the difficulty level based on the number of cells removed
      if (randomCellsToRemove === 30) {
        dispatch(setDifficulty("Easy"));
      } else if (randomCellsToRemove === 40) {
        dispatch(setDifficulty("Medium"));
      } else if (randomCellsToRemove === 50) {
        dispatch(setDifficulty("Hard"));
      }
    }
  }, [board, dispatch]); // This effect runs when the board or dispatch changes

  /**
   * Handles the input change for a Sudoku cell, validating the entered number
   * according to Sudoku rules and updating the board if the entry is valid.
   * Displays an error alert if the number entry violates the rules.
   *
   * @param e - The change event triggered by the input field.
   * @param rowIndex - The row index of the changed cell (0-based).
   * @param colIndex - The column index of the changed cell (0-based).
   */
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>, // Event triggered by the input change
    rowIndex: number, // The row index of the changed cell in the Sudoku board
    colIndex: number // The column index of the changed cell in the Sudoku board
  ) => {
    // Parse the input value and convert it to an integer
    const value = parseInt(e.target.value);

    /**
     * Validates the entered number to ensure it follows Sudoku rules
     * for the specific cell, row, column, and 3x3 subgrid.
     */
    const isValid = isValidEntry(board, lockedCells, rowIndex, colIndex, value);

    // If the entry violates Sudoku rules, display an error alert and stop further processing
    if (!isValid) {
      setAlert({
        type: "error",
        message: "Invalid number entry. This violates Sudoku rules.", // Error message for invalid entry
      });
      return; // Exit the function early if the entry is not valid
    }

    // If the value is a valid number between 1-9, or the input is cleared (empty string)
    if ((value >= 1 && value <= 9) || (e.target.value === "" && isValid)) {
      // Update the Sudoku board, ensuring immutability
      const updatedBoard = board.map(
        (row, rIndex) =>
          rIndex === rowIndex // If the row is the one being edited
            ? row.map(
                (cell, cIndex) =>
                  cIndex === colIndex // If the column is the one being edited
                    ? isNaN(value)
                      ? 0
                      : value // Set the new value or 0 if input is cleared
                    : cell // Keep other cells unchanged
              )
            : row // Keep the other rows unchanged
      );

      // Dispatch the updated board state to the Redux store
      dispatch(setBoard(updatedBoard)); // Update the board in the store
    }
  };

  return (
    <section className="game">
      <table className="game_board">
        <tbody>
          {board.map((row, rowIndex) => (
            // Render each row
            <tr className="game_row" key={rowIndex}>
              {row.map((cell, colIndex) => {
                // Check if the current cell is locked
                const isLocked = lockedCells.has(`${rowIndex}-${colIndex}`);

                return (
                  <td
                    className={`game_cell ${isLocked ? "locked" : ""}`}
                    key={`${rowIndex}-${colIndex}`}
                    onClick={() =>
                      setSelectedCell({ row: rowIndex, col: colIndex })
                    }
                  >
                    <input
                      type="text"
                      maxLength={1}
                      className="sudoku_cell"
                      value={cell !== 0 ? cell : ""} // Display the cell value if it's not 0
                      readOnly={isLocked} // Make the input readonly if the cell is locked
                      onChange={(e) => handleInputChange(e, rowIndex, colIndex)}
                    />
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
};

export default GameTable;
