import React from "react";
import "./GameTable.css";

function GameTable() {
  const rows = [0, 1, 2, 3, 4, 5, 6, 7, 8];

  return (
    <section className="game">
      <table className="game__board">
        <tbody>
          {rows.map((row) => (
            <tr className="game__row" key={row}>
              {rows.map((col) => (
                <td className="game__cell" key={`${row}-${col}`}>
                  {col}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}

export default GameTable;
