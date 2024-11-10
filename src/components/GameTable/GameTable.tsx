import "./GameTable.css";

const GameTable = () => {
  const rows = [0, 1, 2, 3, 4, 5, 6, 7, 8];

  return (
    <section className="game">
      <table className="game_board">
        <tbody>
          {rows.map((row) => (
            <tr className="game_row" key={row}>
              {rows.map((col) => (
                <td className="game_cell" key={`${row}-${col}`}>
                  {col}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
};

export default GameTable;
