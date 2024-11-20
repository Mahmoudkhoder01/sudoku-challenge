import React from "react";
import "./Numbers.css";

interface NumbersProps {
  onNumberClick: (number: number) => void; // Function to handle number clicks
}

const Numbers: React.FC<NumbersProps> = ({ onNumberClick }) => {
  return (
    <div className="status_numbers">
      {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((number) => {
        return (
          <div
            className="status_number"
            key={number}
            onClick={() => onNumberClick(number)}
          >
            {number}
          </div>
        );
      })}
    </div>
  );
};

export default Numbers;
