import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store";
import { generateNewGame } from "../../redux/BoardSlice";
import { getCellsToRemove } from "../../Functions/sudoku";
import "./Header.css";

const Header = () => {
  // Use dispatch hook to dispatch actions to Redux store
  const dispatch = useDispatch<AppDispatch>();

  // Access the current difficulty level from the Redux store
  const difficulty = useSelector(
    (state: RootState) => state.difficulty.difficulty
  );

  // Function to handle the "Generate New Game" action when the user clicks the button
  const handleNewGame = () => {
    // Get the number of cells to remove based on the current difficulty level
    const cellsToRemove = getCellsToRemove(difficulty);

    // Dispatch the action to generate a new game with the correct number of cells to remove
    dispatch(generateNewGame(cellsToRemove));
  };

  return (
    <header className="header">
      {/* Main title of the app, with a stylized "Sudoku" */}
      <h1>
        Su<span className="header_group-one">do</span>
        <span className="header_group-two">ku</span>
      </h1>
      {/* Button to generate a new game, triggers the handleNewGame function on click */}
      <h2 onClick={handleNewGame} className="header_generate-button">
        Generate New Game
      </h2>
    </header>
  );
};

export default Header;
