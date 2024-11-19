import GameTable from "./components/GameTable/GameTable";
import Header from "./components/Header/Header";

function Game() {
  return (
    <div className="container">
      <Header />

      <div className="inner-container">
        <GameTable />;
      </div>
    </div>
  );
}

export default Game;
