import React, { useState } from "react";
import Difficulty from "./components/Difficulty/Difficulty";
import GameTable from "./components/GameTable/GameTable";
import Header from "./components/Header/Header";
import Numbers from "./components/Numbers/Numbers";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "./redux/store";
import { setBoard } from "./redux/BoardSlice";
import Button from "./components/Button/Button";
import { HiOutlineLightBulb } from "react-icons/hi";
import { CiCircleCheck } from "react-icons/ci";
import { IoExtensionPuzzle } from "react-icons/io5";
import { handleCheckClick, handleHintClick } from "./Functions/Buttons";
import ImageUploader from "./components/ImageUploader/ImageUploader";
import { isValidEntry } from "./Functions/sudoku";

interface ButtonProps {
  title: string;
  icon: React.ReactNode;
  onClick: () => void;
}

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

      const isValid = isValidEntry(board, lockedCells, row, col, number);

      if (!lockedCells.has(`${row}-${col}`) && isValid) {
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

  const buttons: ButtonProps[] = [
    {
      title: "Hint",
      icon: <HiOutlineLightBulb size={24} />,
      onClick: () =>
        handleHintClick(
          dispatch,
          fullBoard,
          board,
          lockedCells,
          selectedCell,
          setSelectedCell
        ),
    },
    {
      title: "Check Board",
      icon: <CiCircleCheck size={24} />,
      onClick: () => handleCheckClick(board, fullBoard),
    },
    {
      title: "Solve Board",
      icon: <IoExtensionPuzzle size={24} />,
      onClick: () => dispatch(setBoard(fullBoard)),
    },
  ];

  return (
    <div className="container">
      <Header />

      <div className="inner-container">
        <GameTable setSelectedCell={setSelectedCell} />

        <div className="game-side-section">
          <Difficulty />

          <Numbers onNumberClick={handleNumberClick} />

          {buttons.map((button, index) => {
            return <Button key={index} {...button} />;
          })}

          <ImageUploader />
        </div>
      </div>
    </div>
  );
}

export default Game;
