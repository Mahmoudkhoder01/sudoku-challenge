import React from "react";
import "./Numbers.css";

// Define the interface for the props passed to the Numbers component
interface NumbersProps {
  onNumberClick: (number: number) => void; // Function to handle when a number is clicked
}

const Numbers: React.FC<NumbersProps> = ({ onNumberClick }) => {
  return (
    <div className="status_numbers">
      {/* Map over numbers 1 to 9 to display them as clickable elements */}
      {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((number) => {
        return (
          <div
            className="status_number"
            key={number} // Unique key for each number element
            onClick={() => onNumberClick(number)} // Trigger the onNumberClick function when a number is clicked
          >
            {number} {/* Display the number */}
          </div>
        );
      })}
    </div>
  );
};

export default Numbers;
