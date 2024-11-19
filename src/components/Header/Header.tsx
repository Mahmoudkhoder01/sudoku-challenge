import { useDispatch } from "react-redux";
import { AppDispatch } from "../../redux/store";
import { generateNewGame } from "../../redux/BoardSlice";
import "./Header.css";

const Header = () => {
  const dispatch = useDispatch<AppDispatch>();

  const handleNewGame = () => {
    dispatch(generateNewGame(50));
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
