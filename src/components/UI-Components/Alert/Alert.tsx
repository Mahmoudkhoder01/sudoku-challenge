import React from "react";
import "./Alert.css";

interface AlertProps {
  type?: "success" | "error" | "info" | "warning"; // Define alert types
  message: string;
  onClose: () => void; // Function to handle close action
}

const Alert: React.FC<AlertProps> = ({
  message,
  type = "success",
  onClose,
}) => {
  // Determine the alert class based on the type
  const alertClass = `alert alert-${type}`;

  return (
    <div className="alert-overlay" onClick={onClose}>
      <div className={alertClass} onClick={(e) => e.stopPropagation()}>
        <span>{message}</span>
        <button onClick={onClose}>Ok</button>
      </div>
    </div>
  );
};

export default Alert;
