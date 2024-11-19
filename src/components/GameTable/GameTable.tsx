import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../../redux/store";
import { generateNewGame, setBoard } from "../../redux/BoardSlice";
import "./GameTable.css";

const GameTable = () => {
  const board = useSelector((state: RootState) => state.board.board);
  const lockedCells = useSelector(
    (state: RootState) => state.board.lockedCells
  );

  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    if (board.length === 0) {
      dispatch(generateNewGame(50));
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
