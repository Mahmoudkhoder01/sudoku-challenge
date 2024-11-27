import React, { useState } from "react";
import Difficulty from "./components/Difficulty/Difficulty";
import GameTable from "./components/GameTable/GameTable";
import Header from "./components/Header/Header";
import Numbers from "./components/Numbers/Numbers";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "./redux/store";
import { setBoard } from "./redux/BoardSlice";
import Button from "./components/UI-Components/Button/Button";
import { HiOutlineLightBulb } from "react-icons/hi";
import { CiCircleCheck } from "react-icons/ci";
import { IoExtensionPuzzle } from "react-icons/io5";
import { handleCheckClick, handleHintClick } from "./Functions/Buttons";
import ImageUploader from "./components/ImageUploader/ImageUploader";
import { isValidEntry } from "./Functions/sudoku";
import Alert from "./components/UI-Components/Alert/Alert";

interface ButtonProps {
  title: string;
  icon: React.ReactNode;
  onClick: () => void;
}

export interface AlertStates {
  type: "success" | "error" | "info";
  message: string;
}

interface SelectedCellStates {
  row: number;
  col: number;
}

function Game() {
  const [selectedCell, setSelectedCell] = useState<SelectedCellStates | null>(
    null
  );

  const [alert, setAlert] = useState<AlertStates | null>(null);

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

      if (!isValid) {
        setAlert({
          type: "error",
          message: "Invalid number entry. This violates Sudoku rules.",
        });
        return;
      }

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
      onClick: () => handleCheckClick(board, fullBoard, setAlert),
    },
    {
      title: "Solve Board",
      icon: <IoExtensionPuzzle size={24} />,
      onClick: () => dispatch(setBoard(fullBoard)),
    },
  ];

  // Close the alert
  const closeAlert = () => setAlert(null);

  return (
    <div className="container">
      <Header />

      <div className="inner-container">
        <GameTable setSelectedCell={setSelectedCell} setAlert={setAlert} />

        <div className="game-side-section">
          <Difficulty />

          <Numbers onNumberClick={handleNumberClick} />

          {buttons.map((button, index) => {
            return <Button key={index} {...button} />;
          })}
        </div>
      </div>

      {/* Show the Alert component if there's an active alert */}
      {alert && (
        <Alert
          type={alert.type}
          message={alert.message}
          onClose={closeAlert} // Close alert when the close button is clicked
        />
      )}

      <ImageUploader />
    </div>
  );
}

export default Game;
