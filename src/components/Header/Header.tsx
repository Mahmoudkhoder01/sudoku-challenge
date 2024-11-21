import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store";
import { generateNewGame } from "../../redux/BoardSlice";
import "./Header.css";
import { getCellsToRemove } from "../../Functions/sudoku";

const Header = () => {
  const dispatch = useDispatch<AppDispatch>();

  const difficulty = useSelector(
    (state: RootState) => state.difficulty.difficulty
  );

  const handleNewGame = () => {
    const cellsToRemove = getCellsToRemove(difficulty);

    dispatch(generateNewGame(cellsToRemove));
  };

  return (
    <header className="header">
      <h1>
        Su<span className="header_group-one">do</span>
        <span className="header_group-two">ku</span>
      </h1>
      <h2 onClick={handleNewGame} className="header_generate-button">
        Generate New Game
      </h2>
    </header>
  );
};

export default Header;
