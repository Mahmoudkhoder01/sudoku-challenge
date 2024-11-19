import Difficulty from "./components/Difficulty/Difficulty";
import GameTable from "./components/GameTable/GameTable";
import Header from "./components/Header/Header";
import Numbers from "./components/Numbers/Numbers";

function Game() {
  return (
    <div className="container">
      <Header />

      <div className="inner-container">
        <GameTable />

        <div className="game-side-section">
          <Difficulty />

          <Numbers />
        </div>
      </div>
    </div>
  );
}

export default Game;
