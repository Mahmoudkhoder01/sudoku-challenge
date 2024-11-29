import { useState } from "react";
import GameTable from "./components/GameTable/GameTable";
import Header from "./components/Header/Header";
import Alert from "./components/UI-Components/Alert/Alert";
import SideGame from "./components/SideGame";

export interface AlertStates {
  type: "success" | "error" | "info";
  message: string;
}

export interface SelectedCellStates {
  row: number;
  col: number;
}

function Game() {
  const [selectedCell, setSelectedCell] = useState<SelectedCellStates | null>(
    null
  );

  const [alert, setAlert] = useState<AlertStates | null>(null);

  // Close the alert
  const closeAlert = () => setAlert(null);

  return (
    <div className="container">
      <Header />

      <div className="inner-container">
        <GameTable setSelectedCell={setSelectedCell} setAlert={setAlert} />

        <div className="game-side-section">
          <SideGame
            setSelectedCell={setSelectedCell}
            setAlert={setAlert}
            selectedCell={selectedCell}
          />
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
    </div>
  );
}

export default Game;
