import React, { SetStateAction } from "react";
import Difficulty from "./Difficulty/Difficulty";
import Numbers from "./Numbers/Numbers";
import Button from "./UI-Components/Button/Button";
import { handleCheckClick, handleHintClick } from "../Functions/Buttons";
import { setBoard } from "../redux/BoardSlice";
import { HiOutlineLightBulb } from "react-icons/hi";
import { CiCircleCheck } from "react-icons/ci";
import { IoExtensionPuzzle } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../redux/store";
import { isValidEntry } from "../Functions/sudoku";
import { AlertStates, SelectedCellStates } from "../Game";
import ImageUploader from "./ImageUploader/ImageUploader";

interface ButtonProps {
  title: string;
  icon: React.ReactNode;
  onClick: () => void;
}

interface SideGameProps {
  setSelectedCell: React.Dispatch<
    SetStateAction<{ row: number; col: number } | null | null>
  >;
  setAlert: React.Dispatch<SetStateAction<AlertStates | null>>;
  selectedCell: SelectedCellStates | null;
}

const SideGame: React.FC<SideGameProps> = ({
  setAlert,
  setSelectedCell,
  selectedCell,
}) => {
  const board = useSelector((state: RootState) => state.board.board);

  const fullBoard = useSelector((state: RootState) => state.board.fullBoard); // Get the full solved board

  const lockedCellsArray = useSelector(
    (state: RootState) => state.board.lockedCells
  );

  const lockedCells = new Set(lockedCellsArray);

  const dispatch = useDispatch<AppDispatch>();

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

  return (
    <>
      <Difficulty />

      <Numbers onNumberClick={handleNumberClick} />

      {buttons.map((button, index) => {
        return <Button key={index} {...button} />;
      })}

      <ImageUploader setAlert={setAlert} />
    </>
  );
};

export default SideGame;
