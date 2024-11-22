import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store";
import { setDifficulty } from "../../redux/DifficultySlice";
import { generateNewGame } from "../../redux/BoardSlice"; // Import the generateNewGame action
import "./Difficulty.css";
import { getCellsToRemove } from "../../Functions/sudoku";

const Difficulty = () => {
  const difficulty = useSelector(
    (state: RootState) => state.difficulty.difficulty
  );

  const dispatch = useDispatch<AppDispatch>();

  const handleDifficultyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedDifficulty = e.target.value as "Easy" | "Medium" | "Hard";

    dispatch(setDifficulty(selectedDifficulty));

    const cellsToRemove = getCellsToRemove(selectedDifficulty);

    dispatch(generateNewGame(cellsToRemove)); // Dispatch the action with the correct number of cells
  };

  return (
    <div className="title">
      Difficulty:
      <select
        name="status_difficulty-select"
        className="status_difficulty-select"
        value={difficulty}
        onChange={handleDifficultyChange}
      >
        <option value="Easy">Easy</option>
        <option value="Medium">Medium</option>
        <option value="Hard">Hard</option>
      </select>
    </div>
  );
};

export default Difficulty;
