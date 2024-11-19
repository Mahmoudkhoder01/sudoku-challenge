import "./Numbers.css";

function Numbers() {
  return (
    <div className="status_numbers">
      {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((number) => {
        return (
          <div
            className="status_number"
            key={number}
            // onClick={() => onClickNumber(number.toString())}
          >
            {number}
          </div>
        );
      })}
    </div>
  );
}

export default Numbers;
