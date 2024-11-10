import React from "react";
import GameTable from "./components/GameTable/GameTable";
import Header from "./components/Header/Header";

function Game() {
  return (
    <div className="container">
      <Header />
      
      <GameTable />;
    </div>
  );
}

export default Game;
