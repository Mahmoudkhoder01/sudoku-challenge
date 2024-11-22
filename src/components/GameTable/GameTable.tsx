import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../../redux/store";
import { generateNewGame, setBoard } from "../../redux/BoardSlice";
import "./GameTable.css";
import { setDifficulty } from "../../redux/DifficultySlice";

interface GameTableProps {
  setSelectedCell: (cell: { row: number; col: number } | null) => void;
}

const GameTable: React.FC<GameTableProps> = ({ setSelectedCell }) => {
  const board = useSelector((state: RootState) => state.board.board);

  const lockedCellsArray = useSelector(
    (state: RootState) => state.board.lockedCells
  );

  const lockedCells = new Set(lockedCellsArray);

  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    if (board.length === 0) {
      const difficulties = [30, 40, 50];

      const randomCellsToRemove =
        difficulties[Math.floor(Math.random() * difficulties.length)];

      dispatch(generateNewGame(randomCellsToRemove));

      // Set the difficulty based on the number of cells
      if (randomCellsToRemove === 30) {
        dispatch(setDifficulty("Easy"));
      } else if (randomCellsToRemove === 40) {
        dispatch(setDifficulty("Medium"));
      } else if (randomCellsToRemove === 50) {
        dispatch(setDifficulty("Hard"));
      }
    }
  }, [board, dispatch]);

  return (
    <section className="game">
      <table className="game_board">
        <tbody>
          {board.map((row, rowIndex) => (
            <tr className="game_row" key={rowIndex}>
              {row.map((cell, colIndex) => {
                const isLocked = lockedCells.has(`${rowIndex}-${colIndex}`);

                return (
                  <td
                    className={`game_cell ${isLocked ? "locked" : ""}`}
                    key={`${rowIndex}-${colIndex}`}
                    onClick={() =>
                      setSelectedCell({ row: rowIndex, col: colIndex })
                    } // Set the selected cell
                  >
                    <input
                      type="text"
                      maxLength={1}
                      className="sudoku_cell"
                      value={cell !== 0 ? cell : ""}
                      readOnly={isLocked}
                      onChange={(e) => {
                        const value = parseInt(e.target.value, 10);
                        if (
                          (value >= 1 && value <= 9) ||
                          e.target.value === ""
                        ) {
                          const updatedBoard = [...board];

                          updatedBoard[rowIndex][colIndex] = isNaN(value)
                            ? 0
                            : value;

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
