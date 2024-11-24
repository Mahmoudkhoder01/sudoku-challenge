import { useState } from "react";
import Difficulty from "./components/Difficulty/Difficulty";
import GameTable from "./components/GameTable/GameTable";
import Header from "./components/Header/Header";
import Numbers from "./components/Numbers/Numbers";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "./redux/store";
import { setBoard } from "./redux/BoardSlice";
import Button from "./components/Button/Button";
import { HiOutlineLightBulb } from "react-icons/hi";
import { handleHintClick } from "./Functions/Buttons";
function Game() {
  const [selectedCell, setSelectedCell] = useState<{
    row: number;
    col: number;
  } | null>(null);

  const board = useSelector((state: RootState) => state.board.board);

  const fullBoard = useSelector((state: RootState) => state.board.fullBoard); // Get the full solved board

  const lockedCellsArray = useSelector(
    (state: RootState) => state.board.lockedCells
  );

  const lockedCells = new Set(lockedCellsArray);

  const dispatch = useDispatch<AppDispatch>();

  // Function to update the value of the selected cell
  const handleNumberClick = (number: number) => {
    if (selectedCell) {
      const { row, col } = selectedCell;

      if (!lockedCells.has(`${row}-${col}`)) {
        const updatedBoard = board.map((rowArray, rowIndex) =>
          rowIndex === row
            ? rowArray.map((cell, colIndex) =>
                colIndex === col ? number : cell
              )
            : [...rowArray]
        );

        dispatch(setBoard(updatedBoard));
      }
    }
  };

  return (
    <div className="container">
      <Header />

      <div className="inner-container">
        <GameTable setSelectedCell={setSelectedCell} />

        <div className="game-side-section">
          <Difficulty />

          <Numbers onNumberClick={handleNumberClick} />

          {/* Button triggers the hint functionality */}
          <Button
            title="Hint"
            icon={<HiOutlineLightBulb size={24} />}
            onClick={() =>
              handleHintClick(
                dispatch,
                fullBoard,
                board,
                lockedCells,
                selectedCell,
                setSelectedCell
              )
            }
          />
        </div>
      </div>
    </div>
  );
}

export default Game;
