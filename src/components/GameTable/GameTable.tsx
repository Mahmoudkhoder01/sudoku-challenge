import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../../redux/store";
import { generateNewGame, setBoard } from "../../redux/BoardSlice";
import "./GameTable.css";
import { setDifficulty } from "../../redux/DifficultySlice";

// Define the type for props
interface GameTableProps {
  setSelectedCell: (cell: { row: number; col: number } | null) => void; // Callback to set the selected cell
}

const GameTable: React.FC<GameTableProps> = ({ setSelectedCell }) => {
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
                      onChange={(e) => {
                        // Handle the input change
                        const value = parseInt(e.target.value, 10);
                        // Only update the cell if the input is a valid number (1-9) or empty
                        if (
                          (value >= 1 && value <= 9) ||
                          e.target.value === ""
                        ) {
                          const updatedBoard = board.map((row, rIndex) =>
                            rIndex === rowIndex
                              ? row.map((cell, cIndex) =>
                                  cIndex === colIndex
                                    ? isNaN(value)
                                      ? 0 // If the value is not a valid number, set it to 0
                                      : value // Otherwise, set the value
                                    : cell
                                )
                              : row
                          );

                          // Dispatch the updated board to Redux
                          dispatch(setBoard(updatedBoard));
                        }
                      }}
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
