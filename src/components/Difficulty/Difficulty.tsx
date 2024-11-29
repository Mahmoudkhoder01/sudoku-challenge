import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store";
import { setDifficulty } from "../../redux/DifficultySlice";
import { generateNewGame } from "../../redux/BoardSlice";
import "./Difficulty.css";
import { getCellsToRemove } from "../../Functions/sudoku";

const Difficulty = () => {
  // Access the current difficulty level from the Redux store
  const difficulty = useSelector(
    (state: RootState) => state.difficulty.difficulty
  );

  // Use the dispatch function to send actions to Redux
  const dispatch = useDispatch<AppDispatch>();

  // Handle the change of difficulty level when the user selects a new option from the dropdown
  const handleDifficultyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    // Get the selected difficulty from the event target
    const selectedDifficulty = e.target.value as "Easy" | "Medium" | "Hard";

    // Dispatch an action to update the difficulty in the Redux store
    dispatch(setDifficulty(selectedDifficulty));

    // Get the number of cells to remove based on the selected difficulty
    const cellsToRemove = getCellsToRemove(selectedDifficulty);

    // Dispatch the generateNewGame action with the correct number of cells to remove
    dispatch(generateNewGame(cellsToRemove)); // Generate a new game with the chosen difficulty
  };

  return (
    <div className="title">
      Difficulty:
      {/* Dropdown to select the difficulty */}
      <select
        name="status_difficulty-select"
        className="status_difficulty-select"
        value={difficulty} // Bind the current difficulty to the dropdown value
        onChange={handleDifficultyChange} // Update the difficulty when the user selects an option
      >
        {/* Difficulty options */}
        <option value="Easy">Easy</option>
        <option value="Medium">Medium</option>
        <option value="Hard">Hard</option>
      </select>
    </div>
  );
};

export default Difficulty;
