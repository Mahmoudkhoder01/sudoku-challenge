import "./Difficulty.css";

const Difficulty = () => {
  return (
    <div className="title">
      Difficulty:
      <select
        name="status_difficulty-select"
        className="status_difficulty-select"
      >
        <option value="Easy">Easy</option>

        <option value="Medium">Medium</option>

        <option value="Hard">Hard</option>
      </select>
    </div>
  );
};

export default Difficulty;
